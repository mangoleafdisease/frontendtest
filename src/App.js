/* eslint-disable */
import './App.css';
import { Button, Card, Col, Image, Modal, Row, Upload } from "antd";
import Webcam from "react-webcam";
import { useState } from 'react';
import { isMobile } from "react-device-detect";
import axios from "axios";
import { UploadOutlined } from '@ant-design/icons';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Anthracnose from './Remedies/Anthracnose';
import BacterialCanker from './Remedies/BacterialCanker';
import GailMidge from './Remedies/GailMidge';
import PowderyMildew from './Remedies/PowderyMildew';
import SootyMould from './Remedies/SootyMould';

const url = "https://mango-disease-api.herokuapp.com/predict"

function App() {

  const videoConstraints = {
    width: "auto",
    height: "auto",
    facingMode: "environment"
  };
  const [predicting, setpredicting] = useState(false)
  const [imgSrc, setimgSrc] = useState("")
  const [result, setresult] = useState(null)
  const [show, setshow] = useState(false)

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const PredictLeaf = async (file) => {
    try {

      var formData = new FormData();
      formData.append("file", file);
      await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res.data)
        setresult(res.data)
        //"Anthracnose", "Bacterial Canker", "Gail Midge", "Healthy", "Powdery Mildew", "Sooty Mould" 
        //setpredicting(false)
      }).catch(err => {
        console.log(err.message)
        setresult(null)
        setpredicting(false)
      })
    } catch (err) {
      console.log(err.message)
      setresult(null)
      setpredicting(false)
    }
  }

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const onChange = e => {
    if (e.file.type.includes("image")) {
      switch (e.file.status) {
        case "uploading":
          console.log("uploading")
          break;
        case "done":
          console.log(e.file)
          getBase64(e.file.originFileObj, (url) => {
            setimgSrc(url);
          });

          setpredicting(true)
          PredictLeaf(e.file.originFileObj)
          break;

        default:
          console.log("def")
      }
    } else {
      notification.info({
        message: "Select an image file only!"
      })
    }

  };

  function Remedies(disease){
    console.log(disease)
    switch (disease) {
      case "Anthracnose":
        return <Anthracnose />
      case "Bacterial Canker":
        return <BacterialCanker />
      case "Gail Midge":
        return <GailMidge />
      case "Powdery Mildew":
        return <PowderyMildew />
      case "Sooty Mould":
        return <SootyMould/>
      default:
        return <>Mango Leaf is Healthy</>
    }
  }
  return (
    <Row gutter={[24, 0]}
      style={{
        width: window.innerWidth,
        backgroundColor: "gray",
        height: window.innerHeight,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundImage: "url('https://i.ibb.co/N12WsfX/istockphoto-878922558-612x612.jpg')",
        opacity: "0.8",
        padding: 0, margin: 0
      }}
    >
      {
        isMobile ?
          <Col xs={24}>
            <Modal
              open={show}
              footer={null}
              title={result===null? null : result.class}
              onCancel={() => { setshow(false) }}
              
            >
            <Col  style={{ overflow: "auto", height: window.innerHeight * .7 }}>
              {
                result!==null?
                  Remedies(result.class)
                  :
                <></>
              }
            </Col>
            </Modal>
            <center>
              <Col xs={24} style={{ padding: 10, marginTop: "30%", textAlign: "center" }}>
                <b style={{ fontSize: 30 }} className="text-success bg-white">
                  Mango Leaf Disease <br />
                  Detection
                </b>
              </Col>
              <Col xs={22}
                style={{
                  marginTop: "12%"
                }}
              >

                <Card
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "transparent"
                  }}
                  cover={
                    predicting === false &&
                    <Webcam
                      hidden
                      audio={false}
                      height={"auto"}
                      width={"auto"}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                    >
                      {({ getScreenshot }) => (
                        <Button
                          hidden
                          style={{ marginTop: 20, width: "72%", }}

                          onClick={() => {
                            const imageSrc = getScreenshot();

                            setimgSrc(imageSrc)
                            setpredicting(true)
                            const file = dataURLtoFile(imageSrc, "file")
                            console.log(file)
                            PredictLeaf(file)

                          }}
                          className='btn btn-success'
                        >
                          Capture Mango Leaf
                        </Button>

                      )}
                    </Webcam>
                  }
                  footer={null}
                >
                  {
                    predicting === false &&
                    <Col>
                      <b style={{ color: "black" }} hidden>OR </b><br /><br />
                      <Upload
                        //fileList={selectedFileList}
                        customRequest={dummyRequest}
                        onChange={e => {
                          console.log(e)
                          onChange(e)
                        }}
                      >

                        <Button icon={<UploadOutlined />} className='btn btn-success'>Upload an Image</Button>
                      </Upload>
                    </Col>
                  }
                  {
                    predicting &&
                    <Col xs={24} style={{}}>
                      <center>
                        <Image
                          src={imgSrc}
                          width={"auto"}
                          height={"auto"}
                          preview={false}
                        />
                        {
                          result === null ?
                            <Col style={{ paddingTop: 10 }}>
                              <Button loading={true} variant={"ghost"}
                                style={{ width: "100%" }}
                              >
                                Predicting . . .
                              </Button>
                            </Col>
                            :
                            <div>
                              <Col xs={24} style={{ marginTop: 20, fontSize: 15, color: "white", backgroundColor: result.unable === true ? "red" : "#32CD32", borderRadius: 10 }}>
                                {
                                  result.unable === true ?
                                    <b>Unable to predict image, please try again!</b>
                                    :
                                    <>
                                      Disease Detected:<b> {result.class}</b> <br />
                                      Confidence: <b>{(result.confidence * 100).toFixed(2)}%</b>
                                    </>
                                }
                              </Col>
                              <Col xs={24} style={{ marginTop: 20 }}>
                                <Button type="primary"
                                  onClick={() => {
                                    setresult(null)
                                    setpredicting(false)
                                  }}
                                >
                                  Try Another
                                </Button>
                              </Col>
                              <Col xs={24} style={{ marginTop: 20 }}>
                                <Button danger ghost style={{ color: "white" }}
                                  onClick={() => {
                                    setshow(true)
                                  }}
                                >
                                 <b>Show Remedies</b>
                                </Button>
                              </Col>
                            </div>
                        }
                      </center>
                    </Col>
                  }
                </Card>
              </Col>
            </center>

          </Col>
          :
          <Col xs={24} style={{ marginTop: "10%" }}>
            <center>
              <b>⚠️ Only available on mobile web browser!</b>
            </center>
          </Col>
      }
    </Row>
  );
}

export default App;
