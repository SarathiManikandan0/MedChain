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
const react_1 = __importStar(require("react"));
const DoctorDetailsCard_1 = __importDefault(require("../../../components/cards/DoctorDetailsCard"));
// import { getHospitalByWalletAddress, updateHospital } from '../../../Api';
const index_1 = require("../../api/index");
const ethers_1 = require("ethers");
const pinata_1 = require("../../../Api/pinata");
const Healthcare_json_1 = __importDefault(require("../../../utils/Healthcare.json"));
const sweetalert2_1 = __importDefault(require("sweetalert2"));
function HospitalDashboard() {
    var _a;
    const deployAddress = "0x2a2D6a534Fab584A10A1d09BAeCF81E0977bC124";
    let provider;
    let signer;
    if (typeof window !== 'undefined') {
        provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
    }
    const [filename, setFilename] = (0, react_1.useState)('');
    const [uploaded, setUploaded] = (0, react_1.useState)(false);
    const [hospitalDetails, setHospitalDetails] = (0, react_1.useState)({
        _id: '',
        image: '',
        name: '',
        walletAddress: '',
        email: '',
        description: '',
        location: '',
        telephone: [''],
        allDoctors: {
            doctors: []
        }
    });
    const inputRef = (0, react_1.useRef)(null);
    const [doctorDetails, setDoctorDetails] = (0, react_1.useState)({
        name: ``,
        walletAddress: '',
        email: '',
        description: '',
        image: '',
        specialistAt: '',
        time: '',
        day: ''
    });
    const fetch = () => __awaiter(this, void 0, void 0, function* () {
        var _b, _c;
        try {
            const walletAddress = yield signer.getAddress();
            const response = yield (0, index_1.getHospitalByWalletAddress)(walletAddress);
            const data = response.data.data.hospital[0];
            setHospitalDetails(data);
            setDoctorDetails((_c = (_b = response.data.data.hospital[0]) === null || _b === void 0 ? void 0 : _b.allDoctors) === null || _c === void 0 ? void 0 : _c.doctors);
            return response;
        }
        catch (error) {
            console.log(error);
        }
    });
    const uploadFile = (e) => __awaiter(this, void 0, void 0, function* () {
        let file = e.target.files[0];
        try {
            const response = yield (0, pinata_1.uploadFileToIPFS)(file);
            if (response.success === true) {
                setDoctorDetails(Object.assign(Object.assign({}, doctorDetails), { image: `${response.pinataURL}` }));
                setUploaded(true);
                const data1 = (response.pinataURL).slice(34, 41);
                const data2 = (response.pinataURL).slice(75, (response.pinataURL).length);
                setFilename(`${data1}.....${data2}`);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    const handleAddDoctor = () => __awaiter(this, void 0, void 0, function* () {
        var _d, _e;
        try {
            const contract = new ethers_1.ethers.Contract(deployAddress, Healthcare_json_1.default.abi, signer);
            const id = hospitalDetails === null || hospitalDetails === void 0 ? void 0 : hospitalDetails._id;
            const walletAddress = yield signer.getAddress();
            const response = yield (0, index_1.getHospitalByWalletAddress)(walletAddress);
            const doctor = (_e = (_d = response.data.data.hospital[0]) === null || _d === void 0 ? void 0 : _d.allDoctors) === null || _e === void 0 ? void 0 : _e.doctors;
            let addDoctor;
            if (typeof doctor === 'undefined') {
                addDoctor = {
                    allDoctors: {
                        doctors: [
                            {
                                name: doctorDetails.name,
                                walletAddress: doctorDetails.walletAddress,
                                email: doctorDetails.email,
                                image: doctorDetails.image,
                                description: doctorDetails.description,
                                specialistAt: doctorDetails.specialistAt,
                                availableTime: doctorDetails.time,
                                availableDate: doctorDetails.day
                            }
                        ]
                    }
                };
            }
            else {
                addDoctor = {
                    allDoctors: {
                        doctors: [
                            ...doctor,
                            {
                                name: doctorDetails === null || doctorDetails === void 0 ? void 0 : doctorDetails.name,
                                walletAddress: doctorDetails === null || doctorDetails === void 0 ? void 0 : doctorDetails.walletAddress,
                                email: doctorDetails === null || doctorDetails === void 0 ? void 0 : doctorDetails.email,
                                image: doctorDetails === null || doctorDetails === void 0 ? void 0 : doctorDetails.image,
                                description: doctorDetails === null || doctorDetails === void 0 ? void 0 : doctorDetails.description,
                                specialistAt: doctorDetails === null || doctorDetails === void 0 ? void 0 : doctorDetails.specialistAt,
                                availableTime: doctorDetails === null || doctorDetails === void 0 ? void 0 : doctorDetails.time,
                                availableDate: doctorDetails === null || doctorDetails === void 0 ? void 0 : doctorDetails.day
                            }
                        ]
                    }
                };
            }
            const add = yield (0, index_1.updateHospital)(id, addDoctor);
            const doctorAddress = doctorDetails === null || doctorDetails === void 0 ? void 0 : doctorDetails.walletAddress;
            yield contract.allowDoctor(doctorAddress);
            sweetalert2_1.default.fire({
                position: 'top-end',
                icon: 'success',
                title: 'You Successfully add a Doctor',
                showConfirmButton: false,
                timer: 1500
            });
            window.location.reload();
        }
        catch (error) {
            console.log(error);
            sweetalert2_1.default.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${error.response.data.message}`
            });
        }
    });
    (0, react_1.useEffect)(() => {
        fetch();
    }, []);
    const styles = {
        main: `w-full min-h-screen flex flex-col justify-center items-center`,
        top_container: `w-9/12 flex justify-between items-center`,
        top_left_container: `w-4/12 mt-16 flex flex-col justify-around items-center`,
        top_right_container: `w-6/12 h-full`,
        img_container: `w-10/12 h-full mt-6 mb-6`,
        doc_img_container: `w-10/12 h-3/6 mt-6 mb-6`,
        name_container: `h-10 bg-white border-2 drop-shadow-2xl p-2 mt-10`,
        about_container: `h-28 border-2 mb-10 bg-white drop-shadow-2.5xl p-2 overflow-auto flex flex-col`,
        location_container: `h-16 border-2 mb-10 bg-white drop-shadow-2.5xl p-2 overflow-auto flex flex-col`,
        phone_container: `h-20 border-2 bg-white drop-shadow-2.5xl p-2 overflow-auto flex flex-col`,
        bottom_container: `w-full mt-40 mb-20 flex justify-around`,
        semibold_txt: `font-semibold text-lg`,
        search_area: `border-2 w-6/12 h-10 flex drop-shadow-2xl mb-5 mt-40`,
        sub_box: `w-3/12 bg-white`,
        btn: `w-3/12 bg-high_contrast_yellow border-l-2 active:bg-grinish-yellow`,
        btm_left: `w-3/12 flex flex-col justify-start items-center`,
        btm_right: `w-4/12 mr-20`,
        main_box: `bg-parrot_green w-full h-full drop-shadow-2.5xl border-2 flex flex-col justify-around p-10`,
        input_bg: `h-12 mt-3 mb-3 flex justify-between`,
        large_input_bg: `h-32 mt-5 mb-5`,
        small_input_box: `bg-white border-2 drop-shadow-2xl w-5/12 h-full`,
        l_small_input_box: `bg-ocen_blue border-2 drop-shadow-2xl w-full p-2 h-12 ml-auto cursor-pointer active:drop-shadow-xl active:mt-2`,
        connect_wallet: `bg-high_contrast_yellow border-2 drop-shadow-2xl w-5/12 h-full flex flex-col justify-center items-center active:mt-2 active:drop-shadow-xl active:bg-grinish-yellow`,
        signup: `bg-light-sky border-2 drop-shadow-2xl w-5/12 h-10 mx-auto active:mt-2 active:drop-shadow-xl active:bg-ocen_blue`,
        large_input_box: `bg-white border-2 drop-shadow-2xl w-full h-full`,
    };
    return (<div className={styles.main}>
      <div className={styles.top_container}>
        <div className={styles.top_left_container}>
          <div className={styles.img_container}>
            <img src={`${hospitalDetails === null || hospitalDetails === void 0 ? void 0 : hospitalDetails.image}`} alt="" className='drop-shadow-2.5xl border-4 w-full h-full' onClick={() => console.log(hospitalDetails)}/>
          </div>
          <div className={styles.name_container}>
            <span className={styles.semibold_txt}>{hospitalDetails === null || hospitalDetails === void 0 ? void 0 : hospitalDetails.name}</span>
          </div>
        </div>
        <div className={styles.top_right_container}>
          <div className={styles.about_container}>
            <span className={styles.semibold_txt}>About:</span>
            <span>{hospitalDetails === null || hospitalDetails === void 0 ? void 0 : hospitalDetails.description}</span>
          </div>
          <div className={styles.location_container}>
            <span className={styles.semibold_txt}>Location:</span>
            <span>{hospitalDetails === null || hospitalDetails === void 0 ? void 0 : hospitalDetails.location}</span>
          </div>
          <div className={styles.phone_container}>
            <span className={styles.semibold_txt}>Phone:</span>
            <span>{hospitalDetails === null || hospitalDetails === void 0 ? void 0 : hospitalDetails.telephone}</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom_container}>
        <div className={styles.btm_left}>
          <div className={styles.doc_img_container}>
            <img src="/images/doctor_poster2.png" alt="" className='drop-shadow-2.5xl border-2 w-full h-full'/>
          </div>
          <span className='text-2xl mt-10'>Add Doctors</span>
        </div>
        <div className={styles.btm_right}>

        <div className={styles.main_box}>
            <div className={styles.input_bg}>
              <div className={styles.small_input_box}>
                <input type="text" className='w-full h-full p-2 placeholder:text-2xl' placeholder='name:' onChange={(e) => setDoctorDetails(Object.assign(Object.assign({}, doctorDetails), { name: e.target.value }))}/>
              </div>
              <div className={styles.small_input_box}>
                <input type="text" className='w-full h-full p-2 placeholder:text-xl' placeholder='wallet address:' onChange={(e) => setDoctorDetails(Object.assign(Object.assign({}, doctorDetails), { walletAddress: e.target.value }))}/>
              </div>
            </div>
            <div className={styles.input_bg}>
              <div className={styles.large_input_box}>
                <input type="email" className='w-full h-full p-2 placeholder:text-2xl' placeholder='email:' onChange={(e) => setDoctorDetails(Object.assign(Object.assign({}, doctorDetails), { email: e.target.value }))}/>
              </div>
            </div>

            <div className={styles.large_input_bg}>
              <div className={styles.large_input_box}>
                <textarea name="" className='w-full h-full p-2 placeholder:text-2xl' placeholder='description:' cols={30} rows={10} onChange={(e) => setDoctorDetails(Object.assign(Object.assign({}, doctorDetails), { description: e.target.value }))}></textarea>
              </div>
            </div>

            <div className={styles.input_bg}>
              <div className="flex flex-col items-start">
                <label className={styles.l_small_input_box}>
                  <span>{uploaded ? `Uploaded ✅` : `Upload Image`}</span>
                  <input type="file" ref={inputRef} onChange={uploadFile} className="hidden"/>
                </label>
                <span className="ml-3 text-gray-600">{filename}</span>
              </div>

              <div className={styles.small_input_box}>
                <select name="type" className='h-full w-full' onChange={(e) => setDoctorDetails(Object.assign(Object.assign({}, doctorDetails), { specialistAt: e.target.value }))}>
                  <option value="">Specialist At...</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="DietNutrition">DietNutrition</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Gynecologic">Gynecologic</option>
                  <option value="Nurologic">Nurologic</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="PlasticSurgery">PlasticSurgery</option>
                  <option value="Psychiatric">Psychiatric</option>
                  <option value="Renal">Renal</option>
                  <option value="Urologic">Urologic</option>
                </select>
              </div>

            </div>
            <div className={styles.input_bg}>
              <div className={styles.small_input_box}>
                <input type="text" className='w-full h-full p-2 placeholder:text-sm' placeholder='Time: 9:00am - 5:00pm' onChange={(e) => setDoctorDetails(Object.assign(Object.assign({}, doctorDetails), { time: e.target.value }))}/>
              </div>
              <div className={styles.small_input_box}>
                <input type="text" className='w-full h-full p-2 placeholder:text-lg' placeholder='Day: Mon - Fri' onChange={(e) => setDoctorDetails(Object.assign(Object.assign({}, doctorDetails), { day: e.target.value }))}/>
              </div>
            </div>
            
            <div className={styles.input_bg}>
              <button className={styles.signup} onClick={handleAddDoctor}>
                <span>{`Add Doctor +`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-8/12 mb-20 mt-10">
        {(_a = hospitalDetails.allDoctors) === null || _a === void 0 ? void 0 : _a.doctors.map((i) => {
            return (<DoctorDetailsCard_1.default key={i === null || i === void 0 ? void 0 : i._id} name={i === null || i === void 0 ? void 0 : i.name} image={i === null || i === void 0 ? void 0 : i.image} email={i === null || i === void 0 ? void 0 : i.email} walletAddress={i === null || i === void 0 ? void 0 : i.walletAddress} description={i === null || i === void 0 ? void 0 : i.description} specialistAt={i === null || i === void 0 ? void 0 : i.specialistAt} day={i === null || i === void 0 ? void 0 : i.availableDate} time={i === null || i === void 0 ? void 0 : i.availableTime}/>);
        })}
      </div>
    </div>);
}
exports.default = HospitalDashboard;
