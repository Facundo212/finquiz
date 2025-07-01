import {
  BookUp, BookDown, ListCheck, UsersRound,
} from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import ScoreChart from '@/components/scoreChart';
import { Badge } from '@/components/ui/badge';

import { scoreToColor } from '@/lib/utils';

interface ReportsHeaderProps {
  averageCompletedQuestionnaires: number;
  averageResult: number;
  bestTopic: string;
  worstTopic: string;
  activeStudents: number;
}

function ReportsHeader({
  averageCompletedQuestionnaires,
  averageResult,
  bestTopic,
  worstTopic,
  activeStudents,
}: ReportsHeaderProps) {
  const topicBadge = (topic: string, emptyText: string) => {
    if (!topic) return <p>{emptyText}</p>;

    return (
      <Badge variant="defaultTopic">
        {topic}
      </Badge>
    );
  };

  const boxes = [
    {
      title: 'Promedio de cuestionarios realizados por estudiante',
      content: <span className="text-4xl font-bold">{averageCompletedQuestionnaires}</span>,
      icon: <ListCheck size={50} className="flex-shrink-0 w-auto h-auto" />,
    },
    {
      title: 'Tasa general de aciertos',
      content: <ScoreChart score={averageResult} color={scoreToColor(averageResult)} />,
    },
    {
      title: 'Temas con mejor y peor desempeño',
      content: (
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 text-sm text-muted-foreground items-center justify-start">
            <BookUp color="var(--green-600)" size={40} />
            {topicBadge(bestTopic, 'No hay temas destacados')}
          </div>
          <div className="flex gap-2 text-sm text-muted-foreground items-center justify-start">
            <BookDown color="var(--red-600)" size={40} />
            {topicBadge(worstTopic, 'No hay temas a mejorar')}
          </div>
        </div>
      ),
    },
    {
      title: 'Estudiantes que han completado al menos un cuestionario',
      content: <span className="text-4xl font-bold">{activeStudents}</span>,
      icon: <UsersRound size={50} className="flex-shrink-0 w-auto h-auto" />,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold">Estadísticas generales</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {boxes.map((box) => (
          <Card key={box.title} className="h-full">
            <CardHeader className="w-full flex-col gap-2 items-center align-center">
              {box.icon}
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {box.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">{box.content}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ReportsHeader;
