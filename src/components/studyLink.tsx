import { Link } from 'lucide-react';
import { extractDomain } from '@/lib/utils';

import { Card, CardContent } from '@/components/ui/card';

import eva from '@/assets/eva.png';
import openfing from '@/assets/openfing.png';

interface StudyLinkProps {
  to: string;
  label: string;
}

const imageMapping = {
  'open.fing.edu.uy': openfing,
  'eva.fing.edu.uy': eva,
};

function StudyLink({ to, label }: StudyLinkProps) {
  const baseUrl = extractDomain(to);

  return (
    <a href={to} className="pointer">
      <Card className="w-fit py-1 px-3 rounded-sm hover:bg-gray-200 transition-all duration-400">
        <CardContent className="p-0">
          <div className="flex items-center gap-2">
            {
              imageMapping[baseUrl as keyof typeof imageMapping] ? (
                <img src={imageMapping[baseUrl as keyof typeof imageMapping]} alt="Topic" className="w-3 h-3" />
              ) : (
                <Link className="w-3 h-3" />
              )
            }
            <p className="text-sm">{label}</p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

export { StudyLink };
