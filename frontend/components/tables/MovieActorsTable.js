import BaseTable from "../BaseTable";
import { logClientError } from "../../services/logger";

export default function MovieActorsTable(props) {
  if (props.error) {
    logClientError(
      "MovieActorsTable",
      "Film oyuncuları tablosu hatası",
      props.error,
      "mid"
    );
  }

  return (
    <BaseTable
      {...props}
      title="Film Oyuncuları"
      columns={["MOVIE_LINK", "ACTOR_NAME", "CHARACTER_NAME", "ACTOR_PHOTO"]}
      modalTitles={{
        add: "Yeni Film Oyuncusu Ekle",
        edit: "Film Oyuncusunu Düzenle",
      }}
      keyField="MOVIE_LINK"
    />
  );
}
