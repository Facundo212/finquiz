import { useNavigate } from 'react-router-dom';

import { Card, CardContent } from '@/components/ui/card';
import Loader from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import ScoreChart from '@/components/scoreChart';

import StudentStats from '@/components/studentStats';

import { useGetQuestionnairesQuery, useGetStudentStatsQuery } from '@/services/questionnaires';

function MyQuestionnaires() {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useGetStudentStatsQuery();
  const { data: questionnaires, isLoading: isQuestionnairesLoading } = useGetQuestionnairesQuery();

  if (isQuestionnairesLoading || statsLoading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-foreground mb-8">Mis cuestionarios</h1>
      <div className="mb-8">
        <StudentStats
          stats={stats}
        />
      </div>
      {questionnaires?.data?.length === 0 ? (
        <h2 className="text-lg">Aquí podrás ver tus cuestionarios finalizados, ordenados por fecha</h2>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {questionnaires?.data?.map((questionnaire) => (
            <Card
              key={questionnaire.id}
              className="h-40 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
              onClick={() => navigate(`/questionnaires/${questionnaire.id}/summary`)}
            >
              <CardContent>
                <div className="flex gap-6">
                  <div className="flex flex-col gap-4 flex-1">
                    <h2 className="text-xl font-semibold">{questionnaire.name}</h2>
                    <div className="flex gap-2 min-h-[28px]">
                      {questionnaire.units.length > 0 ? (
                        questionnaire.units.map((unit) => (
                          <Badge className="bg-gray-200 text-black" key={unit.id}>{`Unidad ${unit.position}`}</Badge>
                        ))
                      ) : (
                        <div className="h-[28px]" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{questionnaire.createdAt}</p>
                  </div>

                  <div className="flex items-center justify-center w-1/3">
                    <ScoreChart score={questionnaire.result} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyQuestionnaires;
