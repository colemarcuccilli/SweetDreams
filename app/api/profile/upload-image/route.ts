import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * POST /api/profile/upload-image
 * Upload profile image to Supabase Storage
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const imageType = formData.get('imageType') as string; // cover, profile, square, tall, gallery1, gallery2, gallery3

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!imageType) {
      return NextResponse.json(
        { error: 'Image type is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    console.log(`📸 Uploading ${imageType} image for user:`, user.email);

    // Create unique filename with type prefix
    const fileExt = file.name.split('.').pop();
    const fileName = `${imageType}_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image', details: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);

    console.log('✅ Image uploaded successfully:', publicUrl);

    // If it's a profile picture, sync to BOTH locations for consistency
    if (imageType === 'profile') {
      console.log('🔄 Syncing profile picture to both account and public profile...');

      // 1. Update user_metadata (for account page)
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          profile_photo_url: publicUrl,
        },
      });

      if (metadataError) {
        console.error('⚠️ Failed to update user_metadata:', metadataError);
      } else {
        console.log('✅ Updated user_metadata.profile_photo_url');
      }

      // 2. Update public_profiles table (for public profile page)
      const { error: profileError } = await supabase
        .from('public_profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('⚠️ Failed to update public_profiles:', profileError);
      } else {
        console.log('✅ Updated public_profiles.profile_picture_url');
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath
    });

  } catch (error: unknown) {
    console.error('Upload image error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to upload image', details: errorMessage },
      { status: 500 }
    );
  }
}
