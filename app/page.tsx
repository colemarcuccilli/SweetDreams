import Link from "next/link";
import RecentWork from "@/components/RecentWork";
import VideoHero from "@/components/VideoHero";
import SolutionsAnimated from "@/components/SolutionsAnimated";
import FriendsAnimated from "@/components/FriendsAnimated";
import FeaturedProject from "@/components/FeaturedProject";
import Work from "@/components/Work";
import CTASection from "@/components/CTASection";
import ContentStrategyAnimated from "@/components/ContentStrategyAnimated";
import TransitionSection from "@/components/TransitionSection";
import TransitionSection2 from "@/components/TransitionSection2";
import WhoAreWeAnimated from "@/components/WhoAreWeAnimated";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Promo Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        padding: '10px 48px',
        marginTop: '8px',
        marginBottom: '12px',
        borderBottom: '2px solid #FF8C00',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '14px',
          color: 'black',
          letterSpacing: '0.05em',
          textAlign: 'center'
        }}>
          <strong>Welcome to Dream Suite!</strong> New Account Special: Get 40% off your first session with code <strong>FIRSTTIME40</strong>
        </span>
      </div>

      {/* Video Hero - Only on homepage */}
      <VideoHero />

      {/* Who Are We Section with Animation */}
      <WhoAreWeAnimated />

      {/* Transition Section with Scroll Effect */}
      <TransitionSection />

      {/* Content Strategy Section with Animated Text */}
      <ContentStrategyAnimated />

      {/* Recent Work Carousel */}
      <RecentWork />

      {/* Solutions Section */}
      <SolutionsAnimated />

      {/* Transition Section 2 with Scroll Effect */}
      <TransitionSection2 />

      {/* Friends Section with GSAP Animation */}
      <FriendsAnimated />

      {/* Featured Project Highlight */}
      <FeaturedProject />

      {/* Work Section */}
      <Work />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}