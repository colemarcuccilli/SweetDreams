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