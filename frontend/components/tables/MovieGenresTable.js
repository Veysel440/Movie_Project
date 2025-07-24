import BaseTable from "../BaseTable";
import { logClientError } from "../../services/logger";

export default function MovieGenresTable(props) {
  if (props.error) {
    logClientError(
      "MovieGenresTable",
      "Film türleri tablosu hatası",
      props.error,
      "mid"
    );
  }

  return (
    <BaseTable
      {...props}
      title="Film Türleri"
      columns={["MOVIE_LINK", "GENRE"]}
      modalTitles={{
        add: "Yeni Film Türü Ekle",
        edit: "Film Türünü Düzenle",
      }}
      keyField="MOVIE_LINK"
    />
  );
}
