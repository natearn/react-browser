import Kefir from "kefir";
import sampleStream from "./sample.es6";
import { runBrowser } from "./interface.es6";

let example = sampleStream(5,1);
example.log().onValue(t => runBrowser(document.getElementById('application'),t));
