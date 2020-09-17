export interface RocketChatBanner {
  id: string;
  priority: number;
  title: string;
  text: string;
  textArguments: string[];
  modifiers: unknown[];
  link: string;
  read?: boolean;
}
