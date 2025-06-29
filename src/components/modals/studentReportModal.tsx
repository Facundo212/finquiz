import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import BaseModal from './baseModal';
import { Questionnaire, Topic } from '@/services/questionnaires';

interface StudentReportModalProps {
  student: {
    id: string;
    name: string;
    successTopics: Topic[];
    failureTopics: Topic[];
    correctlyAnsweredQuestionsCount: number;
    incorrectlyAnsweredQuestionsCount: number;
    recentQuestionnaires: Questionnaire[];
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface StatCardProps {
  icon: string;
  title: string;
  content: string | number | undefined;
  fallbackText: string;
}

function StatCard({
  icon,
  title,
  content,
  fallbackText,
}: StatCardProps) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">
        {icon}
        {' '}
        {title}
      </h4>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {content || fallbackText}
      </p>
    </div>
  );
}

function StudentReportModal({ student, open, onOpenChange }: StudentReportModalProps) {
  const topicsData = [
    {
      icon: '🟢',
      title: 'Temas con mejor rendimiento',
      content: student?.successTopics.map((topic) => topic.name).join(', '),
      fallbackText: 'No hay temas con mejor rendimiento',
    },
    {
      icon: '🔴',
      title: 'Temas con peor rendimiento',
      content: student?.failureTopics.map((topic) => topic.name).join(', '),
      fallbackText: 'No hay temas con peor rendimiento',
    },
  ];

  const statsData = [
    {
      icon: '📈',
      title: 'Cantidad de respuestas correctas',
      content: student?.correctlyAnsweredQuestionsCount,
      fallbackText: 'No hay respuestas correctas',
    },
    {
      icon: '📉',
      title: 'Cantidad de respuestas incorrectas',
      content: student?.incorrectlyAnsweredQuestionsCount,
      fallbackText: 'No hay respuestas incorrectas',
    },
  ];

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Reporte de estudiante"
      description={`Detalle de ${student?.name}`}
      className="sm:max-w-[750px]"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {topicsData.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {statsData.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>
        <h4 className="text-sm font-medium mb-2">🗒️ Últimos 5 cuestionarios completados</h4>
        {(student?.recentQuestionnaires?.length ?? 0) > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead>Unidades</TableHead>
                <TableHead>Resultado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student?.recentQuestionnaires.map((questionnaire) => (
                <TableRow key={questionnaire.id}>
                  <TableCell>{questionnaire.name}</TableCell>
                  <TableCell>{questionnaire.createdAt}</TableCell>
                  <TableCell className="max-w-[200px] overflow-x-auto">
                    {questionnaire.units.map((unit) => unit.name).join(', ')}
                  </TableCell>
                  <TableCell>{`${questionnaire.result}%`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">No hay cuestionarios completados</p>
        )}
      </div>
    </BaseModal>
  );
}

export default StudentReportModal;
