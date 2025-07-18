import { useState, useEffect } from "react";
import styles from "../styles/admin.module.css";
import Sidebar from "./Sidebar";
import { fetchData } from "../services/api";
import MoviesTable from "./tables/MoviesTable";
import SeriesTable from "./tables/SeriesTable";
import UsersTable from "./tables/UsersTable";
import MovieActorsTable from "./tables/MovieActorsTable";
import MovieGenresTable from "./tables/MovieGenresTable";
import MovieRatingsCommentsTable from "./tables/MovieRatingsCommentsTable";
import SeriesActorsTable from "./tables/SeriesActorsTable";
import SeriesGenresTable from "./tables/SeriesGenresTable";
import SeriesRatingsCommentsTable from "./tables/SeriesRatingsCommentsTable";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("MOVIES");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newItem, setNewItem] = useState({});
  const [editItem, setEditItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchData(activeTab, setData, setError, setLoading);
  }, [activeTab]);

  const props = {
    activeTab,
    data,
    error,
    setError,
    newItem,
    setNewItem,
    editItem,
    setEditItem,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    fetchData: () => fetchData(activeTab, setData, setError, setLoading),
  };

  const renderTable = () => {
    switch (activeTab) {
      case "MOVIES":
        return <MoviesTable {...props} />;
      case "SERIES":
        return <SeriesTable {...props} />;
      case "USERS":
        return <UsersTable {...props} />;
      case "MOVIE_ACTORS":
        return <MovieActorsTable {...props} />;
      case "MOVIE_GENRES":
        return <MovieGenresTable {...props} />;
      case "MOVIE_RATINGS_COMMENTS":
        return <MovieRatingsCommentsTable {...props} />;
      case "SERIES_ACTORS":
        return <SeriesActorsTable {...props} />;
      case "SERIES_GENRES":
        return <SeriesGenresTable {...props} />;
      case "SERIES_RATINGS_COMMENTS":
        return <SeriesRatingsCommentsTable {...props} />;
      default:
        return <p>Tablo bulunamadı.</p>;
    }
  };

  return (
    <div className={styles.adminContainer}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {loading ? <p>Yükleniyor...</p> : renderTable()}
    </div>
  );
}
