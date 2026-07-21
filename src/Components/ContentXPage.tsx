
import styles from "./ContentXPageStyle.module.css"
import MuxPlayer from "@mux/mux-player-react";
import { GetContentByID, Content_Detailed, Content, GetCourseXContents } from '../api/Content';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ContentXPage() {


    const navigate = useNavigate();

    //define our vars
    const [CurrentContent, setCurrentContent] = useState<Content_Detailed>();
    const [ContentList, setContentList] = useState<Content[]>([]);
    const [SignedUrl, setSignedUrl] = useState<string>();
    const [CurrentContentIndex, setCurrentContentIndex] = useState(0);

    //defining our states


    //for the content list side bar
    const [ContentListLoadingstate, setContentListLoadingstate] = useState<boolean>(true);
    const [Error, setError] = useState<string | null>(null);



    //first we need to get the content id from the url parametres

    const { ContentID } = useParams();


    //fetching the content data from the back end

    useEffect(() => {

        const contentid = Number(ContentID);

        if (isNaN(contentid)) {
            setError("Invalide Content Id");
            return;
        }

        const fetchCurrentContent = async () => {

            const data = await GetContentByID(contentid);
            console.log("RAW =======>" + data);
            if (data.success) {

                console.log("RAW =======>" + data);
                setCurrentContent(data.Content);
                setSignedUrl(data.signedurl);
                console.log(CurrentContent);
                console.log(data);


            } else {
                //somthing went wrong
                console.log("PROBLEM AT FETCHING Content with id :" + ContentID + data.message);

                setError("PROBLEM AT FETCHING Content with id :" + ContentID + data.message);
            }

        }


        fetchCurrentContent();





    }, [ContentID]);



    //fetching the content list if we did n store it in the session storage
    useEffect(() => {



        const fetchCurrentList = async () => {

            const data = await GetCourseXContents(CurrentContent!.courseID);

            if (data.success) {
                setContentList(data.ContentList);
            } else {
                //somthing went wrong
                console.log("PROBLEM AT FETCHING Content with id :" + ContentID + data.message);

                setError("PROBLEM AT FETCHING Content with id :" + ContentID + data.message);
            }

            setContentListLoadingstate(false);
        }




        const Result = sessionStorage.getItem("ContentList");
        if (Result) {
            //data is stored we don t have to fetch it from db
            setContentList(JSON.parse(Result));
            setContentListLoadingstate(false);

        } else {

            // Make sure CurrentContent exists
            if (!CurrentContent) return;
            //fetch content list from db 
            fetchCurrentList();

        }



    }, [CurrentContent]);



    //to sync current content with the indexOfCurrentContent
    useEffect(() => {

        if (!ContentList.length || !CurrentContent) return;



        const idx = ContentList.findIndex(x => x.courseContentID === CurrentContent.courseContentID);
        if (idx != -1) {
            setCurrentContentIndex(idx);
        }





    }, [ContentList, CurrentContent])


    //and also fetch at the side the other content of the course



    if (Error)
        return <h2>Error happend : {Error}</h2>



    const HanldePrevClick = () => {


        setCurrentContentIndex(prev => {

            const newidx = Math.max(prev - 1, 0);
            navigate(`/Content/${ContentList[newidx].courseContentID}`);
            return newidx;

        });



    }

    const HandleNextClick = () => {


        setCurrentContentIndex(prev => {

            const newidx = Math.min(prev + 1, ContentList.length - 1);
            navigate(`/Content/${ContentList[newidx].courseContentID}`);
            return newidx;

        });




    }

    const HandleContentXClick = (index: number) => {

        setCurrentContentIndex(index);
        navigate(`/Content/${ContentList[index].courseContentID}`);

    }





    const RendreCourseContent = ContentListLoadingstate ? (<p>Loading ...</p>) :
        (
            <ul className={styles.content_list}>
                {ContentList.map((item, index) => {

                    return (
                        <li key={item.courseContentID} onClick={() => HandleContentXClick(index)}>
                            {item.contentTitle}
                        </li>
                    );
                }
                )
                }
            </ul>
        )


    return (

        <main className={styles.content_layout}>

            {/*<!-- Sidebar: Course Contents -->*/}
            <aside className={styles.sidebar} id="Course_Contents_Container">
                {RendreCourseContent}
            </aside>

            {/*<!-- Main Content Viewer -->*/}
            <section className={styles.viewer}>
                <h1 id="lesson_title">{CurrentContent?.contentTitle}</h1>

                {/*<!-- Placeholder: video/pdf -->*/}
                <div className={styles.content_box}>
                    <MuxPlayer
                        src={SignedUrl}
                        streamType="on-demand"
                        prefer-playback="native"
                        autoPlay={false}
                    />
                </div>

                {/*<!-- Navigation Buttons -->*/}
                <div className={styles.nav_buttons}>
                    <button id="prev_btn" onClick={HanldePrevClick}> Previous</button>
                    <button id="next_btn" onClick={HandleNextClick}>Next </button>
                </div>
            </section>

        </main>



    );






}

export default ContentXPage;