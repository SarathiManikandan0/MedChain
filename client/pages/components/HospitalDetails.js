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
const DoctorCard_1 = __importDefault(require("../../components/cards/DoctorCard"));
const router_1 = require("next/router");
// import { getSingleHospitalById } from '../../Api';
const index_1 = require("../../pages/api/index");
function HospitalDetails() {
    var _a;
    const router = (0, router_1.useRouter)();
    const [hospitalDetails, setHospitalDetails] = (0, react_1.useState)({
        name: '',
        image: '',
        description: '',
        location: '',
        phone: '',
        allDoctors: {
            doctors: []
        }
    });
    const fetch = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, index_1.getSingleHospitalById)(router.query.data);
            const hospital = response.data.data.hospital[0];
            setHospitalDetails({
                name: hospital.name,
                image: hospital.image,
                description: hospital.description,
                location: hospital.location,
                phone: hospital.telephone,
                allDoctors: hospital.allDoctors
            });
        }
        catch (error) {
            console.log(error);
        }
    });
    (0, react_1.useEffect)(() => {
        fetch();
    }, []);
    const styles = {
        main: `w-full min-h-screen flex flex-col justify-center items-center`,
        top_container: `w-9/12 flex justify-between items-center`,
        top_left_container: `w-4/12 h-96 flex flex-col justify-around items-center`,
        top_right_container: `w-6/12 h-full`,
        img_container: `w-8/12 h-full mt-6 mb-1`,
        name_container: `h-10 bg-white border-2 drop-shadow-2xl p-2`,
        about_container: `h-28 border-2 mb-10 bg-white drop-shadow-2.5xl p-2 overflow-auto flex flex-col`,
        location_container: `h-16 border-2 mb-10 bg-white drop-shadow-2.5xl p-2 overflow-auto flex flex-col`,
        phone_container: `h-20 border-2 bg-white drop-shadow-2.5xl p-2 overflow-auto flex flex-col`,
        bottom_container: `w-8/12 mt-20 mb-20`,
        semibold_txt: `font-semibold text-lg`,
        search_area: `border-2 w-6/12 h-10 flex drop-shadow-2xl mb-5 mt-40`,
        sub_box: `w-3/12 bg-white`,
        btn: `w-3/12 bg-high_contrast_yellow border-l-2 active:bg-grinish-yellow`,
        err_btn: `border-2 h-12 bg-error_red drop-shadow-2.5xl flex justify-center items-center text-white p-5 pl-5 pr-5 active:mt-2 active:drop-shadow-2xl`
    };
    return (<div className={styles.main}>
      <div className={styles.top_container}>
        <div className={styles.top_left_container}>
          <div className={styles.img_container}>
            {!hospitalDetails.image ?
            <button className={styles.err_btn} onClick={fetch}>
                <span>Click Here For Reload</span> 
              </button>
            :
                <img src={`${hospitalDetails.image}`} alt="" className='drop-shadow-2.5xl border-4' onClick={() => { var _a; return console.log((_a = hospitalDetails.allDoctors) === null || _a === void 0 ? void 0 : _a.doctors); }}/>}
          </div>
          <div className={styles.name_container}>
            <span className={styles.semibold_txt}>{hospitalDetails.name}</span>
          </div>
        </div>
        <div className={styles.top_right_container}>
          <div className={styles.about_container}>
            <span className={styles.semibold_txt}>About:</span>
            <span>{hospitalDetails.description}</span>
          </div>
          <div className={styles.location_container}>
            <span className={styles.semibold_txt}>Location:</span>
            <span>{hospitalDetails.location}</span>
          </div>
          <div className={styles.phone_container}>
            <span className={styles.semibold_txt}>Phone:</span>
            <span>{hospitalDetails.phone}</span>
          </div>
        </div>
      </div>

      <div className={styles.search_area}>
        <div className={styles.sub_box}>
          <select name="type" id="" className='h-full border-r-2'>
            <option value="">Search by type...</option>
            <option value="name">name</option>
          </select>
        </div>
        <input type="search" className='w-full h-full p-2 pl-5' placeholder='search'/>
        <button className={styles.btn}>
          <span className='text-2xl'>Search</span>
        </button>
      </div>

      <div className={styles.bottom_container}>
        {(_a = hospitalDetails.allDoctors) === null || _a === void 0 ? void 0 : _a.doctors.map((i) => {
            return (<DoctorCard_1.default key={i._id} id={i._id} name={i.name} image={i.image} description={i.description} specialistAt={i.specialistAt} day={i.availableDate} time={i.availableTime} walletAddress={i.walletAddress}/>);
        })}
      </div>
    </div>);
}
exports.default = HospitalDetails;
