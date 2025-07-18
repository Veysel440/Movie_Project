import BaseTable from "../BaseTable";

export default function SeriesTable(props) {
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
