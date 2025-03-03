import { createContext, useContext, useState, useEffect, useRef } from "react";

export interface UserSettings {
  theme: "system" | "dark" | "light";
  notification: typeof window.Notification.permission;
  audioSettings: {
    enabled: boolean,
    volume: number,
  };
};

interface UserSettingsContext {
  userSettings: UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const UserSettingsContext = createContext<UserSettingsContext | null>(null);

export const UserSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("userSettings");

      if (savedSettings) {
        const parsedSavedSettings: UserSettings = JSON.parse(savedSettings);

        if (parsedSavedSettings.audioSettings.enabled) {
          audioRef.current = new Audio("/nvidia-fe-stock-checker/sounds/notification-alarm-sound.mp3");
          audioRef.current.volume = parsedSavedSettings.audioSettings.volume / 100;
        }

        return { ...parsedSavedSettings, notification: window.Notification.permission };
      }

      return (
        {
          theme: "system",
          notification: window.Notification.permission,
          audioSettings: {
            enabled: false,
            volume: 0.5,
          },
        }
      );
    }

    return (
      {
        theme: "system",
        notification: "default",
        audioSettings: {
          enabled: false,
          volume: 0.5,
        },
      }
    );
  });

  // Save settings to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userSettings", JSON.stringify(userSettings));
    }
  }, [userSettings]);

  return (
    <UserSettingsContext.Provider value={{ userSettings, setUserSettings, audioRef }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

// As a hook to use the context
export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);

  if (!context) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider")
  }

  return context;
};