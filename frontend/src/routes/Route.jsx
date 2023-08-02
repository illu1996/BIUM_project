import { Route, Routes } from 'react-router-dom';
import MainPage from '../components/pages/MainPage/MainPage';
import LoginPage from '../components/pages/LoginPage/LoginPage';
import SignupPage from '../components/pages/SignupPage/SignupPage';
import GameRoomListPage from '../components/pages/GameRoomListPage/GameRoomListPage';
import GameRoomPage from '../components/pages/GameRoomPage/GameRoomPage';
import CreateGameRoom from '../components/pages/CreateGameRoomPage/CreateGameRoomPage';
import { ProfilePage } from '../components/pages/ProfilePage/ProfilePage';
import PrivateRoute from './PrivateRoute';

function RouteLink(props) {
  return (
    <div>
      <Routes>
        <Route index element={<MainPage />} />
        <Route element={<PrivateRoute authentication={false} />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/createroom" element={<CreateGameRoom />} />
        <Route path="/gameroomlist" element={<GameRoomListPage />} />
        <Route path="/gameroom" element={<GameRoomPage />} />
        <Route element={<PrivateRoute authentication={true} />}>
          <Route path="/profile/:userEmail" element={<ProfilePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default RouteLink;
