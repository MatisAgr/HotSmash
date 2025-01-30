import { React } from 'react';

import PostList from '../../components/Affichage/PostList';
import ListUsers from '../../components/ListUsers/ListUsers';
import SendMessage from '../../components/Form/SendMessage';


export default function Home() {

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barre latérale */}
      <div className="w-1/4 bg-white p-4 border-r">
        <SendMessage />
      </div>

      {/* Flux principal avec défilement indépendant */}
      <div className="w-2/4 p-4 overflow-y-auto" id="scrollableDiv">
        <h1 className="text-2xl font-bold mb-4">Accueil</h1>
        <PostList />
      </div>

      {/* Section latérale */}
      <div className="w-1/4 bg-white p-4 border-l">
        <ListUsers />
      </div>
    </div>
  );
}