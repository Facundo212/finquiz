import { useState } from 'react';
import { Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import BaseModal from '@/components/modals/baseModal';
import { Badge } from '@/components/ui/badge';

interface UnitInfoModalProps {
  unit: {
    id: number;
    name: string;
    description: string;
    topics: {
      id: number;
      name: string;
      description: string;
      shortDescription: string;
      notes?: string;
    }[];
  };
}

function UnitInfoModal({ unit }: UnitInfoModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInfoClick = (e: React.MouseEvent) => {
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
        size="icon"
        className="absolute top-2 right-2 z-10"
        onClick={handleInfoClick}
        data-info-button
      >
        <Info className="w-4 h-4" />
      </Button>

      <BaseModal
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
        title={unit.name}
        description="Información detallada de la unidad"
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Descripción</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {unit.description}
            </p>
          </div>

          {unit.topics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Temas incluidos</h4>
              <div className="space-y-3">
                {unit.topics.map((topic) => (
                  <div key={topic.id} className="space-y-1">
                    <Badge variant="defaultTopic">
                      {topic.name}
                    </Badge>
                    <p className="text-xs text-muted-foreground ml-1">
                      {topic.shortDescription}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </BaseModal>
    </>
  );
}

export default UnitInfoModal;
