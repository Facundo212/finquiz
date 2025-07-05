import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Topic {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  notes?: string;
}

interface PrerequisiteTopicsManagerProps {
  allTopics: Topic[];
  selectedTopics?: Topic[];
  currentTopicId?: number;
  onChange: (selectedTopics: Topic[]) => void;
}

function PrerequisiteTopicsManager({
  allTopics,
  selectedTopics = [],
  currentTopicId,
  onChange,
}: PrerequisiteTopicsManagerProps) {
  const availableTopics = allTopics.filter(
    (topic) => topic.id !== currentTopicId
      && !selectedTopics.some((selected) => selected.id === topic.id),
  );

  const handleAddTopic = (topic: Topic) => {
    onChange([...selectedTopics, topic]);
  };

  const handleRemoveTopic = (topicId: number) => {
    onChange(selectedTopics.filter((topic) => topic.id !== topicId));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedTopics.map((topic) => (
          <Badge
            key={topic.id}
            variant="defaultTopic"
            className="flex items-center gap-1 pr-1"
          >
            {topic.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleRemoveTopic(topic.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {availableTopics.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge
                variant="outline"
                className={cn(
                  'cursor-pointer border-dashed border-primary text-primary transition-all duration-200',
                  'hover:bg-primary/10 hover:border-solid hover:shadow-sm',
                  'active:scale-95',
                )}
              >
                + Agregar Tema
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto w-80 p-2 shadow-lg border border-border bg-popover">
              {availableTopics.map((topic) => (
                <DropdownMenuItem
                  key={topic.id}
                  onClick={() => handleAddTopic(topic)}
                  className={cn(
                    'cursor-pointer rounded-md px-3 py-2.5 text-sm transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground',
                    'mb-1 last:mb-0',
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{topic.name}</span>
                    {topic.shortDescription && (
                      <span className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {topic.shortDescription}
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export default PrerequisiteTopicsManager;
