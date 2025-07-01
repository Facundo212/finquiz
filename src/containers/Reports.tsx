import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import ReportsHeader from '@/components/reportsHeader';
import ReportsStudentTable from '@/components/reportsStudentTable';

import { downloadFile } from '@/lib/utils';

import { useCourseReportsQuery, useLazyQuestionsCSVQuery } from '@/services/api';

function Reports() {
  const { courseId } = useParams();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useCourseReportsQuery({
    courseId: courseId ?? '',
    page,
  });

  const [triggerCSVDownload, { data: csvData, error: csvError, isLoading: isDownloading }] = useLazyQuestionsCSVQuery();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleExportCSV = () => {
    if (!courseId) return;
    triggerCSVDownload({ courseId });
  };

  useEffect(() => {
    if (csvData) {
      const filename = `course_${courseId}_questions_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.csv`;
      downloadFile(csvData as string, filename);
    }
  }, [csvData, courseId]);

  useEffect(() => {
    if (csvError) {
      if ('status' in csvError) {
        const fetchError = csvError as FetchBaseQueryError;
        const errorMessages = fetchError.data as string[];
        toast.error(errorMessages?.[0] || 'Error al descargar el archivo CSV');
      } else {
        toast.error('Error inesperado al descargar el archivo CSV');
      }
    }
  }, [csvError]);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold">{`Reportes de ${course.name || 'curso'}`}</h1>
        <Button
          onClick={handleExportCSV}
          disabled={isDownloading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isDownloading ? (
            'Descargando...'
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Exportar preguntas
            </>
          )}
        </Button>
      </div>
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
