"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { FULL_NAME, JOB_TITLE, EMAIL_ADDRESS } from "@/config";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import AvatarProfile from "@/assets/avatar-profile.jpg";
import { useC } from "../context";
import { useIsMobile, useIsCompact } from "../hooks";
import { NAV_ITEMS, SIDEBAR_STATS } from "../constants";
import { Separator } from "./helpers";
import { ThemeToggle } from "./theme-toggle";

export function SidebarPanel({
  active,
  goto,
}: {
  active: string;
  goto: (id: string) => void;
}) {
  const C = useC();
  const isMobile = useIsMobile();
  const isCompact = useIsCompact();
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      {/* Profile */}
      <div
        style={{
          padding: isMobile ? "16px 16px 12px" : isCompact ? "18px 20px 12px" : "36px 24px 20px",
          textAlign: "center",
        }}
      >
        {/* Avatar with pulsing rings */}
        <div
          style={{
            display: "inline-block",
            position: "relative",
            marginBottom: "18px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                inset: `-${i * 12}px`,
                borderRadius: "50%",
                border: `1px solid rgba(225,29,72,${0.4 - i * 0.1})`,
              }}
              animate={{ scale: [1, 1.12], opacity: [0.6, 0] }}
              transition={{
                duration: 2.2,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
          <motion.div
            style={{
              borderRadius: "50%",
              padding: "3px",
              background: `linear-gradient(135deg, ${C.indigoDark}, ${C.indigo})`,
              boxShadow: `0 0 32px rgba(225,29,72,0.5)`,
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div
              style={{
                width: isMobile ? "72px" : isCompact ? "88px" : "108px",
                height: isMobile ? "72px" : isCompact ? "88px" : "108px",
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <img
                src={AvatarProfile as unknown as string}
                alt={FULL_NAME}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
              />
            </div>
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            color: C.textSidebar,
            fontSize: "16px",
            fontWeight: 800,
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {FULL_NAME}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            fontSize: "12px",
            fontWeight: 600,
            marginTop: "5px",
            color: C.indigo,
          }}
        >
          {JOB_TITLE}
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          style={{
            display: "flex",
            marginTop: isCompact ? "10px" : "18px",
            gap: "1px",
            borderRadius: "12px",
            overflow: "hidden",
            border: `1px solid ${C.borderSidebar}`,
          }}
        >
          {SIDEBAR_STATS.map(({ label, value }) => (
            <div
              key={label}
              style={{
                flex: 1,
                padding: isCompact ? "6px 6px" : "10px 6px",
                textAlign: "center",
                backgroundColor: C.sidebarHover,
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: C.indigo,
                  margin: 0,
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontSize: "10px",
                  color: C.textSidebarDim,
                  margin: 0,
                  letterSpacing: "0.04em",
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <Separator />

      {/* Social */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          padding: isCompact ? "8px 0" : "14px 0",
        }}
      >
        {[
          { href: GITHUB_URL, Icon: Github, label: "GitHub" },
          { href: LINKED_IN_URL, Icon: Linkedin, label: "LinkedIn" },
          { href: `mailto:${EMAIL_ADDRESS}`, Icon: Mail, label: "Email" },
        ].map(({ href, Icon, label }) => (
          <motion.a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{ scale: 1.12, backgroundColor: C.indigoDark }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: C.sidebarHover,
              color: C.textSidebarDim,
              border: `1px solid ${C.borderSidebar}`,
              textDecoration: "none",
            }}
          >
            <Icon size={16} />
          </motion.a>
        ))}
      </motion.div>

      <Separator />

      {/* Nav */}
      <nav
        aria-label="Portfolio sections"
        style={
          isMobile
            ? {
                padding: "8px 0",
                overflowX: "auto",
                display: "flex",
                flexDirection: "row",
                scrollbarWidth: "none",
              }
            : {
                padding: isCompact ? "8px 8px" : "14px 10px",
                flex: 1,
                overflowY: "auto",
                minHeight: 0,
                scrollbarWidth: "none",
              }
        }
      >
        {NAV_ITEMS.map(({ id, label, num }, i) => {
          const on = active === id;
          if (isMobile) {
            return (
              <motion.button
                key={id}
                onClick={() => goto(id)}
                whileTap={{ scale: 0.95 }}
                aria-current={on ? "page" : undefined}
                style={{
                  padding: "8px 14px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  fontSize: "12px",
                  fontWeight: 700,
                  backgroundColor: on ? C.indigoDark : "transparent",
                  color: on ? "#fff" : C.textSidebarDim,
                  marginLeft: i === 0 ? "8px" : "4px",
                  marginRight: i === NAV_ITEMS.length - 1 ? "8px" : "0",
                  transition: "background-color 0.15s, color 0.15s",
                }}
              >
                {label}
              </motion.button>
            );
          }
          return (
            <motion.button
              key={id}
              onClick={() => goto(id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.04, duration: 0.3 }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              aria-current={on ? "page" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: isCompact ? "7px 12px" : "11px 14px",
                borderRadius: "10px",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                borderTop: "none",
                borderRight: "none",
                borderBottom: "none",
                backgroundColor: on ? C.sidebarHover : "transparent",
                borderLeft: `2px solid ${on ? C.indigoDark : "transparent"}`,
                transition: "background-color 0.15s, border-left-color 0.15s",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: on ? C.indigoDark : C.borderSidebar,
                }}
              >
                {num}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: on ? C.textSidebar : C.textSidebarDim,
                }}
              >
                {label}
              </span>
              {on && (
                <motion.div
                  layoutId="nav-dot"
                  style={{
                    marginLeft: "auto",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: C.indigoDark,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div
        style={{
          padding: "10px 20px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <ThemeToggle />
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "10px",
            color: C.textSidebarDim,
          }}
        >
          <MapPin size={9} /> Cebu, Philippines
        </span>
      </div>
    </div>
  );
}
