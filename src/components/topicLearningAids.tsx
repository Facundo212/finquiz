import { StudyLink } from './studyLink';

import { Topic } from '@/services/questionnaires';

interface TopicLearningAidsProps {
  topic: Topic;
  className?: string;
}

function TopicLearningAids({ topic, className }: TopicLearningAidsProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-4 mt-4">
        {
          topic.learningAids.map((learningAid) => (
            <StudyLink key={learningAid.id} to={learningAid.url} label={learningAid.name} />
          ))
        }
      </div>
    </div>
  );
}

export { TopicLearningAids };
