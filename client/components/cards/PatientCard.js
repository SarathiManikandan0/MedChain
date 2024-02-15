"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaticProps = void 0;
const react_1 = __importStar(require("react"));
// import { getSinglePatientByWalletAddress } from '../../Api';
const index_1 = require("../../pages/api/index");
const pinata_1 = require("../../Api/pinata");
const sweetalert2_1 = __importDefault(require("sweetalert2"));
const ethers_1 = require("ethers");
const Healthcare_json_1 = __importDefault(require("../../utils/Healthcare.json"));
const getStaticProps = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        revalidate: 5,
        props: {
            walletAddress: ''
        }
    };
});
exports.getStaticProps = getStaticProps;
function PatientCard(props) {
    const [displayFileName, setDisplayFileName] = (0, react_1.useState)('');
    const [fileName, setFileName] = (0, react_1.useState)('');
    const [uploaded, setUploaded] = (0, react_1.useState)(false);
    const [sendClick, setSendClick] = (0, react_1.useState)(false);
    const [reportName, setReportName] = (0, react_1.useState)('');
    const [patientDetails, setPatientDetails] = (0, react_1.useState)({
        name: '',
        email: '',
        age: 0,
        gender: '',
    });
    const inputRef = (0, react_1.useRef)(null);
    const deployAddress = "0x2a2D6a534Fab584A10A1d09BAeCF81E0977bC124";
    let provider;
    let signer;
    if (typeof window !== 'undefined') {
        provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
    }
    const uploadFile = (e) => __awaiter(this, void 0, void 0, function* () {
        let file = e.target.files[0];
        try {
            const response = yield (0, pinata_1.uploadFileToIPFS)(file);
            if (response.success === true) {
                setFileName(response.pinataURL);
                setUploaded(true);
                const data1 = (response.pinataURL).slice(34, 41);
                const data2 = (response.pinataURL).slice(65, (response.pinataURL).length);
                setDisplayFileName(`${data1}.....${data2}`);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    const fetch = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const patient = yield (0, index_1.getSinglePatientByWalletAddress)(props.walletAddress);
            const singlePatient = patient.data.data.patient[0];
            setPatientDetails({
                name: singlePatient.name,
                email: singlePatient.email,
                age: singlePatient.age,
                gender: singlePatient.gender
            });
            console.log("singlePatient: ", singlePatient);
        }
        catch (error) {
            console.log(error);
        }
    });
    const setReport = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setSendClick(prev => !prev);
            sweetalert2_1.default.fire({
                title: 'Name of the report',
                html: `<input type="text" id="name" class="swal2-input" placeholder="Name of the report">`,
                confirmButtonText: 'Done',
                focusConfirm: false,
                preConfirm: () => {
                    var _a, _b;
                    const name = (_b = (_a = sweetalert2_1.default.getPopup()) === null || _a === void 0 ? void 0 : _a.querySelector('#name')) === null || _b === void 0 ? void 0 : _b.value;
                    if (!name) {
                        sweetalert2_1.default.showValidationMessage(`Please enter name`);
                    }
                    return { name: name };
                }
            }).then((result) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                console.log("Clicked");
                setReportName((_a = result.value) === null || _a === void 0 ? void 0 : _a.name);
                sweetalert2_1.default.fire(`
          Name: ${(_b = result.value) === null || _b === void 0 ? void 0 : _b.name}
        `.trim());
            }));
        }
        catch (error) {
            console.log(error);
        }
    });
    const sendReport = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setSendClick(prev => !prev);
            const contract = new ethers_1.ethers.Contract(deployAddress, Healthcare_json_1.default.abi, signer);
            console.log("Contract", contract);
            console.log("_to: ", props.walletAddress);
            console.log("_reportName: ", reportName);
            console.log("_prescription: ", fileName);
            const response = yield contract.sendReport(props.walletAddress, reportName, fileName);
            sweetalert2_1.default.fire({
                position: 'top-end',
                icon: 'success',
                title: 'You Successfully Send the report',
                showConfirmButton: false,
                timer: 1500
            });
            window.location.reload();
        }
        catch (error) {
            console.log(error);
        }
    });
    (0, react_1.useEffect)(() => {
        fetch();
    }, []);
    const styles = {
        card_container: `border-2 w-full h-42 bg-white drop-shadow-2xl p-2 flex justify-between items-center mb-10`,
        left: `h-full w-7/12 flex flex-col p-2`,
        mid: `h-full w-2/12 mr-20`,
        right: `h-full w-2/12 p-2`,
        l_small_input_box: `bg-ocen_blue border-2 drop-shadow-2xl w-11/12 p-2 h-12 ml-auto cursor-pointer active:drop-shadow-xl active:mt-2`,
        btn: `bg-light-sky w-full h-10 drop-shadow-2xl active:drop-shadow-xl active:mt-2 border-2`,
        btn_green: `bg-deep_green w-full h-10 drop-shadow-2xl active:drop-shadow-xl active:mt-2 border-2`
    };
    return (<div className={styles.card_container}>
      <div className={styles.left}>
        <span className='text-xl font-semibold'>{patientDetails.name}</span>
        <span>{patientDetails.email}</span>
        <span>{props.walletAddress}</span>
        <div className='flex w-3/12 justify-between'>
          <span>age: {patientDetails.age}+</span>
          <span>{patientDetails.gender}</span>
        </div>
      </div>
      <div className={styles.mid}>
        <div className="flex items-center flex-col">
          <label className={styles.l_small_input_box}>
            <span>{uploaded ? `Uploaded` : `Upload report +`}</span>
            <input type="file" ref={inputRef} onChange={uploadFile} className="hidden"/>
          </label>
          <span className="ml-3 text-gray-600">{displayFileName}</span>
        </div>
      </div>
      <div className={styles.right}>
        {sendClick ?
            <button className={styles.btn_green} onClick={sendReport}>
            <span>{"Click here to Send"}</span>
          </button>
            :
                <button className={styles.btn} onClick={setReport}>
            <span>{"Send Report >>"}</span>
          </button>}
        
      </div>
    </div>);
}
exports.default = PatientCard;
