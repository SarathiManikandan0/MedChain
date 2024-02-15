"use strict";
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
const react_1 = __importDefault(require("react"));
const getStaticProps = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        revalidate: 5,
        props: {
            name: '',
            image: ''
        }
    };
});
exports.getStaticProps = getStaticProps;
function HospitalCard(props) {
    const styles = {
        main_container: `w-96 h-96 flex flex-col justify-between items-center`,
        img_container: `w-8/12 h-4/6 drop-shadow-2.5xl active:mt-2 active:drop-shadow-2xl`,
        name_container: `border-2 mb-10 h-10 min-w-6/12 bg-white drop-shadow-2xl p-2 contain active:mt-2 active:drop-shadow-xl`
    };
    return (<div className={styles.main_container}>
      <div className={styles.img_container}>
        <img src={`${props.image}`} alt="" className='w-full h-full border-2'/>
      </div>
      <div className={styles.name_container}>
        <span>{props.name}</span>
      </div>
    </div>);
}
exports.default = HospitalCard;
