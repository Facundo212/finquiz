import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

function BaseModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  className = 'sm:max-w-[600px] max-h-[90vh] overflow-hidden',
}: BaseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="py-2">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)] pr-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

BaseModal.defaultProps = {
  trigger: undefined,
  description: undefined,
  className: 'sm:max-w-[600px] max-h-[90vh] overflow-hidden',
};

export default BaseModal;
