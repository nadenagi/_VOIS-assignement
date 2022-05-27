import axios from "axios";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../App.module.css";
import Drobdown from "../components/drobdown/dropdown";
import {
  BEFOREINITIALDATA,
  INITIALDATA,
  FETCHEDDATAERROR,
} from "../store/types/chart";
import { UPDATEDDATA } from "../store/types/filter";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  onClick: function (event: any, elem: any) {
    window.open(`/details/${elem.id}`, "_self");
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const dumbChartData = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [70, 50, 10, 60, 40, 20, 30, 100, 80, 60, 20, 10, 30, 50, 80],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      pointStyle: "circle",
      pointRadius: 5,
      pointBackgroundColor: "rgb(255,255,255)",
    },
    {
      label: "Dataset 2",
      data: [100, 50, 10, 60, 40, 20, 30, 100, 80, 60, 20, 10, 30, 50, 80],
      borderColor: "rgb(147, 66, 218)",
      backgroundColor: "rgba(147, 66, 218, 0.5)",
      pointStyle: "circle",
      pointBackgroundColor: "rgb(255,255,255)",
      pointRadius: 5,
    },
  ],
};

function Home() {
  const dispatch = useDispatch();
  const data = useSelector((state: any) => state.dataFetched.data);
  const filters = useSelector((state: any) => state.filters.data);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCamp, setSelectedCamp] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [countriesFilter, setCountriesFilter] = useState<any>();
  const [campsFilter, setCampsFilter] = useState<any>();
  const [schoolsFilter, setSchoolsFilter] = useState<any>();
  const [totalLessons, setTotalLessons] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [lineChartSelectedSchools, setLineChartSelectedSchools] = useState<
    any[]
  >([]);
  const [chartData, setChartData] = useState(dumbChartData);
  const [selectedPoint, setSelectedPoint] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log("filters", filters);
    if (data?.length) {
      setStaticData();
    } else {
      getData();
    }
  }, [data]);

  const getData = async () => {
    const url =
      "https://raw.githubusercontent.com/abdelrhman-arnos/analysis-fe-challenge/master/data.json";

    dispatchValues(BEFOREINITIALDATA, [], true);

    await axios
      .get(url)
      .then((res: any) => {
        if (res?.data) {
          dispatchValues(INITIALDATA, res.data);
        }
      })
      .catch((err: any) => {
        dispatchValues(
          FETCHEDDATAERROR,
          {},
          false,
          "An error occurred. Awkward.."
        );
      });
  };

  const setStaticData = () => {
    const countriesList: any = [
      ...new Set<any>(data?.map((item: any) => item.country)),
    ];
    const campsList: any = [
      ...new Set<any>(data?.map((item: any) => item.camp)),
    ];
    const schoolsList: any = [
      ...new Set<any>(data?.map((item: any) => item.school)),
    ];

    schoolsList.push("show all");

    setCountriesFilter(countriesList);
    setCampsFilter(campsList);
    setSchoolsFilter(schoolsList);

    dispatchValues(UPDATEDDATA, {
      countries: countriesList,
      camps: campsList,
      schools: schoolsList,
    });
  };

  function dispatchValues(
    type = "",
    data = {},
    isLoading = false,
    error = false || ""
  ) {
    dispatch({ type, data, isLoading, error });
  }

  useEffect(() => {
    updateDataset();
  }, [selectedCountry, selectedCamp, selectedSchool]);

  const updateDataset = () => {
    const countriesList = [
      ...new Set<any>(
        data?.filter((item: any) =>
          selectedCountry === "show all"
            ? item.country
            : item.country === selectedCountry
        )
      ),
    ];
    const campsList = [
      ...new Set<any>(
        data?.filter((item: any) =>
          selectedCamp === "show all" ? item.camp : item.camp === selectedCamp
        )
      ),
    ];
    const schoolsList = [
      ...new Set<any>(
        data?.filter((item: any) =>
          selectedSchool === "show all"
            ? item.school
            : item.school === selectedSchool
        )
      ),
    ];

    let array = [countriesList, campsList, schoolsList];
    let filtered = array.reduce((a, b) => {
      return a.filter((c) => {
        return b.some((d) => {
          return d.id === c.id;
        });
      });
    });

    const uniqueSchools = [...new Set(filtered?.map((item) => item.school))];
    let finalData: any[] = [];

    uniqueSchools.forEach((unique) => {
      let filteredWithUniqueName = filtered?.filter((item) => {
        return item.school === unique;
      });
      let totalForUniqueName = 0;
      filteredWithUniqueName.forEach((uniqueName) => {
        totalForUniqueName = totalForUniqueName + uniqueName.lessons;
      });
      finalData.push({
        lessons: totalForUniqueName,
        school: unique,
        data: labels?.map((month) => {
          let foundIndex = filteredWithUniqueName?.findIndex(
            (item) => item.month === month
          );
          if (foundIndex !== -1) {
            return filteredWithUniqueName[foundIndex].lessons;
          } else {
            return 0;
          }
        }),
      });
    });

    let totalLessons = 0;
    filtered.forEach((item) => (totalLessons += item.lessons));
    setTotalLessons(totalLessons);
    setLineChartSelectedSchools([]);

    
    dispatchValues(UPDATEDDATA, {
      ...filters,
      points: finalData
    });
  };

  const addRemoveToLineChart = (data: any, index: number) => {
    const randomBetween = (min: number, max: number) =>
      min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);
    const rgb = `rgb(${r},${g},${b})`;
    let root = document.documentElement;
    root.style.setProperty(`--color-ballet-${index + 1}`, rgb);
    data.rgb = rgb;
    if (
      lineChartSelectedSchools.some((element) => element.school === data.school)
    ) {
      let dataFiltered = lineChartSelectedSchools.filter(
        (element) => element.school !== data.school
      );
      data.active = false;
      setLineChartSelectedSchools(dataFiltered);
    } else {
      data.active = true;
      data.color = rgb;
      setLineChartSelectedSchools((prevState) => {
        return [...prevState, data];
      });
    }
  };

  useEffect(() => {
    let dataset = lineChartSelectedSchools?.map((item) => {
      return {
        label: item.school,
        data: item.data,
        borderColor: item.rgb,
        backgroundColor: item.rgb,
        pointStyle: "circle",
        pointRadius: 5,
        pointBackgroundColor: "rgb(255,255,255)",
        pointHoverBackgroundColor: item.rgb,
      };
    });
    setChartData({ labels, datasets: dataset });
  }, [lineChartSelectedSchools]);

  return (
    <div className={styles.App}>
      <h1>Analysis Chart</h1>
      <h3>Number of lessons</h3>
      <div className={styles.drobdownsContainer}>
        {data?.length && filters?.camps?.length && (
          <>
            <div className={styles.drobdownWrapper}>
              Countries:
              <Drobdown
                list={filters?.countries}
                selectedItem={filters?.countries[0]}
                setSelectedItem={setSelectedCountry}
              />
            </div>

            <div className={styles.drobdownWrapper}>
              Camps:
              <Drobdown
                list={filters?.camps}
                selectedItem={filters?.camps[0]}
                setSelectedItem={setSelectedCamp}
              />
            </div>

            <div className={styles.drobdownWrapper}>
              School:
              <Drobdown
                list={filters?.schools}
                selectedItem={filters?.schools[0]}
                setSelectedItem={setSelectedSchool}
              />
            </div>
          </>
        )}
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.lineChart}>
          {data && (
            <Line
              options={{
                onClick: function (event: any, elem: any) {
                  let clickedPoint = data.filter((item: any) => {
                    return (
                      item.month === labels[elem[0].index] &&
                      item.school ===
                        chartData?.datasets[elem[0].datasetIndex].label &&
                      item.lessons ===
                        chartData?.datasets[elem[0].datasetIndex].data[
                          elem[0].index
                        ]
                    );
                  });
                  localStorage.setItem(
                    "point",
                    JSON.stringify(clickedPoint[0])
                  );
                  setSelectedPoint(clickedPoint);
                  navigate("/details");
                },
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                  title: {
                    display: true,
                    text: "Chart.js Line Chart",
                  },
                },
              }}
              data={chartData}
            />
          )}
        </div>
        <div className={styles.sideData}>
          <div className={styles.totalLessons}>
            <span>{totalLessons}</span> lessons <br />
            in {selectedCamp}
          </div>

          <div className={styles.lessonsContainer}>
            {filters?.points && (
              <>
                {filters?.points?.map((data: any, index: number) => (
                  <div
                    className={`${data?.active ? styles.active : ""} ${
                      styles.lesson
                    }`}
                    key={index}
                    onClick={() => addRemoveToLineChart(data, index)}
                  >
                    <span>{data?.lessons}</span> lessons <br />
                    in {data?.school}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
