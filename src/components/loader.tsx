import { Spinner } from '@/components/ui/spinner';

function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner size="large" />
    </div>
  );
}

export default Loader;
