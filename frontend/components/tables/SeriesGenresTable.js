import BaseTable from "../BaseTable";

export default function SeriesGenresTable(props) {
  return (
    <BaseTable
      {...props}
      title="Dizi Türleri"
      columns={["SERIES_LINK", "GENRE"]}
      modalTitles={{ add: "Yeni Dizi Türü Ekle", edit: "Dizi Türünü Düzenle" }}
      keyField="SERIES_LINK"
    />
  );
}
