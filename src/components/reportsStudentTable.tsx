import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { CustomPagination, Pagination } from '@/components/customPagination';
import StudentReportModal from '@/components/modals/studentReportModal';

import { Questionnaire, Topic } from '@/services/questionnaires';
import { scoreToColor } from '@/lib/utils';

interface StudentStats {
  id: string;
  name: string;
  completedQuestionnairesCount: number;
  averageResult: number;
  successTopics: Topic[];
  failureTopics: Topic[];
  correctlyAnsweredQuestionsCount: number;
  incorrectlyAnsweredQuestionsCount: number;
  recentQuestionnaires: Questionnaire[];
}

interface ReportsStudentTableProps {
  studentsStats: StudentStats[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

function ReportsStudentTable({ studentsStats, pagination, onPageChange }: ReportsStudentTableProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentStats | null>(null);

  const renderCorrectRate = (rate: number) => (
    <div className="flex items-center gap-2">
      <Progress value={rate} color={scoreToColor(rate)} />
      <span className="text-muted-foreground">
        {`${rate}%`}
      </span>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold">Estudiantes</h2>
      <br />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Nombre</TableHead>
            <TableHead className="w-1/3">Total de cuestionarios completados</TableHead>
            <TableHead className="w-1/3">Tasa de respuestas correctas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentsStats.map((student: StudentStats) => (
            <TableRow key={student.id}>
              <TableCell className="w-1/3">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(student)}
                  className="hover:text-blue-800 hover:underline cursor-pointer"
                >
                  {student.name}
                </button>
              </TableCell>
              <TableCell className="w-1/3">{student.completedQuestionnairesCount}</TableCell>
              <TableCell className="w-1/3">{renderCorrectRate(student.averageResult)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CustomPagination pagination={pagination} onPageChange={onPageChange} />
      <StudentReportModal
        student={selectedStudent}
        open={!!selectedStudent}
        onOpenChange={(open) => !open && setSelectedStudent(null)}
      />
    </div>
  );
}

export default ReportsStudentTable;
