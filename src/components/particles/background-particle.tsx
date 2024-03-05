import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import { useThemeStore } from "@/stores";

interface ParticleInterface {
  darkMode: boolean;
  lightParticle: string;
}

const darkParticle = "#F7F7F8";

const GetParticle = (props: ParticleInterface) => {
  const { darkMode, lightParticle } = props;
  return {
    background: {
      opacity: 0,
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "connect",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        connect: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: darkMode ? darkParticle : lightParticle,
      },
      links: {
        value: darkParticle,
        distance: 150,
        enable: false,
        opacity: 0.1,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 0.3,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 200,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: {
          min: 0.5,
          max: 2,
        },
      },
    },
    detectRetina: true,
  };
};

export const BackgroundParticle = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);
  const { enableParticleBackground, getTheme, color } = useThemeStore();

  const getColor = () => {
    switch (color) {
      case "azure":
        return "#3B82F6";
      case "emerald":
        return "#22C55E";
      case "golden":
        return "#FACC15";
      case "sunset":
        return "#EA580C";
      case "lavender":
        return "#6D28D9";
      case "scarlet":
        return "#E11D48";
      case "silver":
        return "#57616D";
      default:
        return "#3C38A7";
    }
  };

  return (
    <Particles
      className={enableParticleBackground ? "" : "hidden  "}
      id="tsparticles"
      init={particlesInit}
      options={
        GetParticle({ darkMode: getTheme(), lightParticle: getColor() }) as any
      }
    />
  );
};
