import { useNavigate } from 'react-router-dom';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import TopicsInfoModal from './modals/topicsInfoModal';

import { StudentStats as StudentStatsType } from '@/services/questionnaires';

interface StudentStatsProps {
  stats: StudentStatsType | undefined;
}

function StudentStats({ stats }: StudentStatsProps) {
  const questionnairesCount = stats?.questionnairesCount;
  const successTopics = stats?.successTopics;
  const failureTopics = stats?.failureTopics;

  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
      <Card
        className="h-64 bg-gradient-to-br from-white to-gray-50/50"
      >
        <CardContent className="flex flex-col justify-between h-full p-6 pt-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 leading-tight">
              {questionnairesCount === 0
                ? '¡Comienza tu primer cuestionario!'
                : 'Cuestionarios Realizados'}
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80
                           flex items-center justify-center shadow-lg ring-4 ring-primary/10">
              <span className="text-3xl font-bold text-white">
                {questionnairesCount || 0}
              </span>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              className="text-sm text-primary cursor-pointer hover:text-primary hover:font-bold transition-all duration-200"
              onClick={() => navigate('/')}
            >
              {questionnairesCount === 0
                ? 'Crear cuestionario'
                : 'Crear nuevo cuestionario'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card
        className="h-64"
      >
        <CardContent className="flex flex-col justify-between h-full p-6 pt-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 leading-tight">
              ¿Dónde mejorar?
            </h3>
          </div>

          <div className="flex flex-wrap gap-1 justify-center items-start px-2 py-2">
            { failureTopics && failureTopics.length > 0 ? (
              failureTopics.slice(0, 4).map((topic) => (
                <Badge key={topic.id} variant="defaultTopic">
                  {topic.name}
                </Badge>
              ))
            ) : (
              <Badge variant="defaultTopic">
                No hay temas de mejora
              </Badge>
            )}
          </div>

          <div className="text-center">
            <TopicsInfoModal
              className="text-sm text-primary cursor-pointer hover:text-primary hover:font-bold transition-all duration-200"
              modalTitle="Ver más"
              topics={failureTopics || []}
            />
          </div>
        </CardContent>
      </Card>

      <Card
        className="h-64"
      >
        <CardContent className="flex flex-col justify-between h-full p-6 pt-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 leading-tight">
              La rompes con tus respuestas en
            </h3>
          </div>

          <div className="flex flex-wrap gap-1 justify-center items-start px-2 py-2">
            {successTopics && successTopics.length > 0 ? (
              successTopics.slice(0, 4).map((topic) => (
                <Badge key={topic.id} className="text-black bg-[#abc2ba] px-3 py-1">
                  {topic.name}
                </Badge>
              ))
            ) : (
              <Badge className="text-black bg-[#abc2ba] px-3 py-1">
                No hay temas destacados
              </Badge>
            )}
          </div>

          <div className="text-center">
            <TopicsInfoModal
              className="text-sm text-primary cursor-pointer hover:text-primary hover:font-bold transition-all duration-200"
              modalTitle="Ver más"
              badgeColor="#abc2ba"
              topics={successTopics || []}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentStats;
