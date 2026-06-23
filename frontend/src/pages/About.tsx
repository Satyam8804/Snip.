import { useEffect, useRef, useState } from "react";
import Reveal from "../utils/Reveal";

interface GitHubProfile {
  name: string;
  login: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location: string | null;
  blog: string | null;
}

const TECH_STACK = [
  "Node.js",
  "Express",
  "MongoDB",
  "React",
  "TypeScript",
  "Redux Toolkit",
  "Tailwind CSS",
  "JWT",
];

const About = () => {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [triggered, setTriggered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Lazy fetch — only fires when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://api.github.com/users/Satyam8804");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProfile(data);
      } catch {
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [triggered]);

  return (
    <div
      ref={sectionRef}
      className="min-h-[calc(100vh-52px)] bg-white px-4 py-16"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Reveal delay={0}>
          <div className="text-center mb-4">
            <h1 className="text-3xl font-medium text-gray-900 tracking-tight">
              The person behind Snip
            </h1>
          </div>
        </Reveal>

        {/* Profile card */}
        <Reveal delay={100}>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6 min-h-[200px]">
            {loading && (
              <div className="flex items-center justify-center h-40">
                <p className="text-[13px] text-gray-400">Loading profile...</p>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-40">
                <p className="text-[13px] text-red-400">{error}</p>
              </div>
            )}

            {profile && (
              <>
                <div className="flex items-start gap-6">
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="w-20 h-20 rounded-xl border border-gray-100 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-medium text-gray-900 tracking-tight mb-0.5">
                      {profile.name}
                    </h2>
                    <p className="text-[13px] text-gray-400 mb-3">
                      @{profile.login}
                    </p>

                    {profile.bio && (
                      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                        {profile.bio}
                      </p>
                    )}

                    <div className="flex items-center gap-4 flex-wrap">
                      {profile.location && (
                        <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
                          📍 {profile.location}
                        </span>
                      )}
                      {profile.blog && (
                        <a
                          href={profile.blog}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          🔗 {profile.blog}
                        </a>
                      )}

                      <a
                        href={profile.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        ⭐ GitHub Profile
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-100">
                  {[
                    { val: profile.public_repos, label: "Repositories" },
                    { val: profile.followers, label: "Followers" },
                    { val: profile.following, label: "Following" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-xl font-medium text-gray-900 font-mono tracking-tight">
                        {s.val}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Reveal>

        {/* About Snip */}
        <Reveal delay={200}>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
            <h3 className="text-[13px] font-medium text-gray-900 mb-3">
              About Snip
            </h3>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
              Snip is a full-stack URL shortener built with Node.js, Express,
              MongoDB on the backend and React + TypeScript on the frontend. It
              features JWT authentication, click analytics, link expiry via
              MongoDB TTL indexes, and Base62 code generation with collision
              detection.
            </p>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default About;
