interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface Navigator {
  getInstalledRelatedApps(): Promise<
    {
      platform: string;
      url: string;
      id: string;
      userVisible: boolean;
    }[]
  >;
}
