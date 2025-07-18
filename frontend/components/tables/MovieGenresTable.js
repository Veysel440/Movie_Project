import BaseTable from "../BaseTable";

export default function MovieGenresTable(props) {
  return (
    <BaseTable
      {...props}
      title="Film Türleri"
      columns={["MOVIE_LINK", "GENRE"]}
      modalTitles={{ add: "Yeni Film Türü Ekle", edit: "Film Türünü Düzenle" }}
      keyField="MOVIE_LINK"
    />
  );
}
