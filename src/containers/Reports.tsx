import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import ReportsHeader from '@/components/reportsHeader';
import ReportsStudentTable from '@/components/reportsStudentTable';

import { useCourseReportsQuery } from '@/services/api';

function Reports() {
  const { courseId } = useParams();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useCourseReportsQuery({
    courseId: courseId ?? '',
    page,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-theme(space.16))]">
        <Spinner size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-theme(space.16))]">
        <h1 className="text-2xl font-bold text-red-500">Error al cargar el curso</h1>
      </div>
    );
  }

  const {
    course, generalStats, studentsStats, pagination,
  } = data;
  const {
    averageCompletedQuestionnairesPerStudent,
    averageResult,
    bestResultTopic,
    worstResultTopic,
    activeStudents,
  } = generalStats;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-semibold">{`Reportes de ${course.name || 'curso'}`}</h1>
      <br />
      <ReportsHeader
        averageCompletedQuestionnaires={averageCompletedQuestionnairesPerStudent}
        averageResult={averageResult}
        bestTopic={bestResultTopic?.name}
        worstTopic={worstResultTopic?.name}
        activeStudents={activeStudents.length}
      />
      <br />
      <ReportsStudentTable
        studentsStats={studentsStats}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Reports;
