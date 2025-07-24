import BaseTable from "../BaseTable";
import { logClientError } from "../../services/logger";

export default function SeriesTable(props) {
  if (props.error) {
    logClientError(
      "SeriesTable",
      "Diziler yönetimi tablosu hatası",
      props.error,
      "mid"
    );
  }

  return (
    <BaseTable
      {...props}
      title="Diziler Yönetimi"
      columns={[
        "ID",
        "LINK",
        "TITLE",
        "POSTER",
        "DESCRIPTION",
        "TMDB_RATING",
        "FIRST_AIR_DATE",
        "LAST_AIR_DATE",
        "SEASONS",
        "EPISODES",
        "EPISODE_DURATION",
      ]}
      truncateFields={["DESCRIPTION"]}
      modalTitles={{ add: "Yeni Dizi Ekle", edit: "Diziyi Düzenle" }}
      keyField="ID"
    />
  );
}
