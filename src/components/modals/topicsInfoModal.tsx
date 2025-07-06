import { useState } from 'react';

import { Topic } from '@/services/questionnaires';

import BaseModal from '@/components/modals/baseModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TopicLearningAids } from '@/components/topicLearningAids';

interface TopicsInfoModalProps {
  className?: string;
  modalTitle?: string;
  badgeColor?: string;
  topics: Topic[];
}

function TopicsInfoModal({
  className,
  modalTitle = 'Temas',
  badgeColor,
  topics,
}: TopicsInfoModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  return (
    <>
      <Button
        variant="ghost"
        className={className || 'text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer'}
        onClick={handleOpenModal}
      >
        {modalTitle}
      </Button>

      <BaseModal
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
        title={modalTitle}
        description="Información detallada de los temas"
      >
        <div className="h-96 overflow-y-auto space-y-4 pr-2">
          {topics.length > 0 ? (
            <div className="space-y-3">
              {topics.map((topic) => (
                <div key={topic.id} className="space-y-1">
                  <Badge
                    variant="defaultTopic"
                    className={badgeColor ? `bg-[${badgeColor}]` : undefined}
                  >
                    {topic.name}
                  </Badge>
                  <p className="text-xs text-muted-foreground ml-1">
                    {topic.shortDescription || 'No hay descripción disponible.'}
                  </p>

                  <div className="my-4">
                    <h3 className="font-bold">
                      {`Para repasar ${topic.name}`}
                    </h3>
                    <TopicLearningAids topic={topic} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay temas disponibles.
            </p>
          )}
        </div>
      </BaseModal>
    </>
  );
}

export default TopicsInfoModal;
