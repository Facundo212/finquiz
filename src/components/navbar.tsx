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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useLogoutMutation } from '@/services/api';
import { RootState } from '@/reducers/store';

function Navbar() {
  const [logout, { isLoading, isSuccess }] = useLogoutMutation();

  const { user: { name, email } } = useSelector((state: RootState) => state.session);

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
    <nav className="flex items-center justify-end gap-3 p-6 py-0 h-15 bg-primary">
      <span className="text-white font-normal">{name}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="m-6 my-0 w-48">
          <DropdownMenuLabel className="font-light">{email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer font-semibold"
            onClick={handleLogout}
            disabled={isLoading}
          >
            Salir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export default Navbar;
