import BaseTable from "../BaseTable";
import { logClientError } from "../../services/logger";

export default function MoviesTable(props) {
  if (props.error) {
    logClientError(
      "MoviesTable",
      "Filmler yönetimi tablosu hatası",
      props.error,
      "mid"
    );
  }

  return (
    <BaseTable
      {...props}
      title="Filmler Yönetimi"
      columns={[
        "ID",
        "LINK",
        "TITLE",
        "POSTER",
        "DESCRIPTION",
        "TMDB_RATING",
        "RELEASE_DATE",
        "DURATION",
      ]}
      truncateFields={["DESCRIPTION"]}
      modalTitles={{ add: "Yeni Film Ekle", edit: "Filmi Düzenle" }}
      keyField="ID"
    />
  );
}
