import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Sweet Dreams Music Studio project based on your media inventory
  const sampleProject = {
    title: 'SWEET DREAMS MUSIC STUDIO',
    client: 'Sweet Dreams Production',
    client_name: 'Sweet Dreams Production',
    client_logo_url: 'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/logos/SweetDreamsMusicLogo.png',
    category: 'BRAND FILM',
    location: 'Fort Wayne, Indiana',
    year: 2024,
    purpose: 'Studio Tour & Brand Showcase',
    services: ['Videography', 'Photography', 'Editing', 'Branding'],
    description: 'A cinematic tour of our professional recording studio, showcasing state-of-the-art equipment and creative spaces.',
    short_description: 'A cinematic tour of our professional recording studio.',
    full_description: 'This project highlights the Sweet Dreams Music recording studio in Fort Wayne, Indiana. We captured the professional atmosphere, cutting-edge equipment, and creative energy that makes this space perfect for artists to develop their sound. From the control room to the live tracking space, every detail was carefully filmed to showcase what makes this studio special.',
    cloudflare_stream_id: 'd912b8bd58831e95431db3c24791e44b',
    cloudflare_stream_url: 'https://iframe.videodelivery.net/d912b8bd58831e95431db3c24791e44b',
    cloudflare_thumbnail_url: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/d912b8bd58831e95431db3c24791e44b/thumbnails/thumbnail.jpg?time=1s',
    additional_images: [
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/SweetDreamsMusicStudio/DSC00039.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/SweetDreamsMusicStudio/DSC00041.jpg',
      'https://fweeyjnqwxywmpmnqpts.supabase.co/storage/v1/object/public/media/projects/SweetDreamsMusicStudio/DSC00043.jpg'
    ],
    thumbnail_url: 'https://customer-w6h9o08eg118alny.cloudflarestream.com/d912b8bd58831e95431db3c24791e44b/thumbnails/thumbnail.jpg?time=1s',
    video_url: 'https://iframe.videodelivery.net/d912b8bd58831e95431db3c24791e44b',
    featured: 1,
    coming_soon: false,
    published: true,
    sort_order: 1,
    slug: 'sweet-dreams-music-studio'
  };

  const { data, error } = await supabase
    .from('portfolio_projects')
    .insert([sampleProject])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    project: data,
    viewUrl: `/work/${data.id}`
  });
}
