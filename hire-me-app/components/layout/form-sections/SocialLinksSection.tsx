import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Link,
  Github,
  Linkedin,
  Globe,
  Twitter,
} from "lucide-react";
import { SocialLink } from "@/types/candidate";

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
  onSocialLinksChange: (socialLinks: SocialLink[]) => void;
}

export function SocialLinksSection({
  socialLinks,
  onSocialLinksChange,
}: SocialLinksSectionProps) {
  const platforms = [
    { value: "GitHub", label: "GitHub", icon: Github },
    { value: "LinkedIn", label: "LinkedIn", icon: Linkedin },
    { value: "Portfolio", label: "Portfolio", icon: Globe },
    { value: "Twitter", label: "Twitter", icon: Twitter },
    { value: "DevFolio", label: "DevFolio", icon: Globe },
  ] as const;

  const addSocialLink = () => {
    const newSocialLink: SocialLink = {
      id: Date.now().toString(),
      platform: "GITHUB",
      url: "",
    };
    onSocialLinksChange([...socialLinks, newSocialLink]);
  };

  const removeSocialLink = (id: string) => {
    onSocialLinksChange(socialLinks.filter((link) => link.id !== id));
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    onSocialLinksChange(
      socialLinks.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      )
    );
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find((p) => p.value === platform);
    return platformData ? platformData.icon : Link;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Link className="w-5 h-5" />
          Social Links
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Add links to your professional profiles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {socialLinks.map((link, index) => {
          const IconComponent = getPlatformIcon(link.platform);
          return (
            <div
              key={link.id}
              className="p-4 border border-border rounded-lg bg-muted/20"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-medium text-foreground">
                    Social Link {index + 1}
                  </h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocialLink(link.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Platform</Label>
                  <Select
                    value={
                      platforms.find(
                        (p) =>
                          p.value.toUpperCase() === link.platform.toUpperCase()
                      )?.value || ""
                    }
                    onValueChange={(value) =>
                      updateSocialLink(link.id, {
                        platform: value as SocialLink["platform"],
                      })
                    }
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => {
                        const Icon = platform.icon;
                        return (
                          <SelectItem
                            key={platform.value}
                            value={platform.value}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {platform.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">URL</Label>
                  <Input
                    value={link.url}
                    onChange={(e) =>
                      updateSocialLink(link.id, { url: e.target.value })
                    }
                    placeholder="https://github.com/username"
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={addSocialLink}
          className="w-full border-border hover:bg-muted"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Social Link
        </Button>
      </CardContent>
    </Card>
  );
}
