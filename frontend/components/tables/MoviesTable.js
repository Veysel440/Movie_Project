import BaseTable from "../BaseTable";

export default function MoviesTable(props) {
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
