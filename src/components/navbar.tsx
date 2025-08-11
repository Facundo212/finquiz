import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { useLogoutMutation } from '@/services/api';
import { RootState } from '@/reducers/store';

function Navbar() {
  const [logout, { isLoading, isSuccess }] = useLogoutMutation();

  const {
    user: {
      name, email, role, selectedCourseId,
    },
  } = useSelector((state: RootState) => state.session);

  const navigate = useNavigate();

  useEffect(
    () => {
      if (isSuccess) {
        navigate('/');
      }
    },
    [isSuccess, navigate],
  );

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="flex items-center justify-between gap-3 p-6 py-0 h-15 bg-primary">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="
          text-white font-bold text-xl bg-transparent
          border-none p-0 cursor-pointer hover:opacity-80
          focus:outline-none focus:ring-2 focus:ring-offset-2
          focus:ring-offset-primary focus:ring-white
          flex items-center gap-3
        "
      >
        <div className="bg-white rounded-full p-1">
          <img src="/finquiz.png" alt="FinQuiz" className="w-6 h-6" />
        </div>
        FinQuiz
      </button>
      <div className="flex items-center gap-3">
        <span className="text-white font-normal">{name}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>
                {name?.split(' ').slice(0, 2).map((n) => n[0]).join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="m-6 my-0 w-48">
            <DropdownMenuLabel className="font-light truncate">{email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {role === 'student' && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate('/my-questionnaires')}
              >
                Mis cuestionarios
              </DropdownMenuItem>
            )}
            {role === 'teacher' && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate(`/courses/${selectedCourseId}/reports`)}
              >
                Reportes
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="cursor-pointer font-semibold"
              onClick={handleLogout}
              disabled={isLoading}
            >
              Salir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default Navbar;
