import * as msgPack from "./msgpack";
import { isEqual, cloneDeep } from "lodash";

main();

function main() {
    let testRow = {
        number1: 1,
        number2: 20,
        number3: 200,
        number4: 200000,
        number5: 8000000000000,
        number6: -1,
        number7: -200,
        number8: -8000000000000,
        number9: 0.3,
        number10: 123.456,
        number11: -100.234,
        number12: -456789.345,
        number13: -0.127666,
        text1: "Abc",
        text2: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel odio vehicula, commodo turpis non, fringilla mi. Sed ornare urna ut accumsan cursus.",
        text3: "In fermentum dui convallis, finibus velit ut, aliquam urna. Fusce vitae arcu dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut efficitur aliquet nulla, euismod sodales lorem blandit eu. Etiam rhoncus felis non nunc aliquam ullamcorper.",
        text4: " Mauris vestibulum nibh nec gravida ullamcorper. Donec congue fermentum arcu, a interdum leo sollicitudin nec. Quisque pharetra nisl vitae lacinia iaculis. Donec egestas, dui eget faucibus tincidunt, dui eros sodales mauris, lobortis porta mauris odio eu dui. In vestibulum sodales felis, non faucibus eros volutpat vitae.",
        text5: "この記事の内容の信頼性について検証が求められています。確認のための文献や情報源をご存じの方はご提示ください。出典を明記し、記事の信頼性を高めるためにご協力をお願いします。議論はノートを参照してください。（2008年11月）",
        text6: "Some emoticons: 🐀򐀀 🐀򐰀 🐀򠠀 🐀򡀀",
        flag: true,
        list1: [1, 2, "A", "bc", false],
        list2: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        list3: [123, 4567, 89012, 345678, 9012345, 67890123, 456789012, 3456789012, 34567890123],
        list4: [0.123, 1.234, 2.3456, 3.45678, 4.5678901, 5.1234567, 6.123456],
        list5: ["A", "Bb", "C", "Dd", "E", "Ff", "G", "Hh", "I", "Jj"],
        obj1: {
            a: 123,
            b: 456,
            c: 1.2,
            d: "Text",
            obj: {
                x: 0,
                y: 4096,
                z: -3
            }
        }
    };

    logMessage("------------------------------------------------------------")
    logMessage("testing encode, decode row with msgpack ....");
    if (!testEncodeDecodeMsgPack(testRow)) {
        logMessage("error: msgpack implementation doesn't work correctly");
        return;
    }
    logMessage("OK msgPack works");

    const testCallCounter = 50e3;

    logMessage("------------------------------------------------------------")
    logMessage("encoding row " + testCallCounter + "x with msgPack ....");
    let result = runTest(testCallCounter, () => {
        msgPack.encode(testRow);
    });
    logMessage("time:" + result + " ms");

    logMessage("encoding row " + testCallCounter + "x with native JSON .....");
    result = runTest(testCallCounter, () => {
        JSON.stringify(testRow);
    });
    logMessage("time:" + result + " ms");

    logMessage("------------------------------------------------------------")
    logMessage("decoding row " + testCallCounter + "x with msgPack ....");
    let encodedData = msgPack.encode(testRow);
    result = runTest(testCallCounter, () => {
        msgPack.decode(encodedData);
    });
    logMessage("time:" + result + " ms");

    logMessage("decoding row " + testCallCounter + "x with native JSON .....");
    let jsonEncodedData = JSON.stringify(testRow);
    result = runTest(testCallCounter, () => {
        JSON.parse(jsonEncodedData);
    });
    logMessage("time:" + result + " ms");

    const largeData = multiplyRow(testRow, testCallCounter);

    logMessage("------------------------------------------------------------")
    logMessage("encoding large data set - " + largeData.length + " rows - 2x with msgPack ....");
    result = runTest(2, () => {
        msgPack.encode(largeData);
    });
    logMessage("time:" + result + " ms");

    logMessage("encoding large data set - " + largeData.length + " rows - 2x with native JSON....");
    result = runTest(2, () => {
        JSON.stringify(largeData);
    });
    logMessage("time:" + result + " ms");

    logMessage("------------------------------------------------------------")
    logMessage("decoding large data set - " + largeData.length + " rows - 2x with msgPack ....");
    encodedData = msgPack.encode(largeData);
    result = runTest(2, () => {
        msgPack.decode(encodedData);
    });
    logMessage("time:" + result + " ms");

    logMessage("decoding large data set - " + largeData.length + " rows - 2x with native JSON....");
    jsonEncodedData = JSON.stringify(largeData);
    result = runTest(2, () => {
        JSON.parse(jsonEncodedData);
    });
    logMessage("time:" + result + " ms");
}

function testEncodeDecodeMsgPack(data: object): boolean {
    const encodedData = msgPack.encode(data);
    return isEqual(data, msgPack.decode(encodedData));
}

function multiplyRow(row: Object, multiplier: number): Object[] {
    const listOfRows = [];
    for (let i = 0; i < multiplier; i++) {
        const newRow = cloneDeep(row) as any;
        newRow.id = i;
        listOfRows.push(newRow);
    }
    return listOfRows;
}

function runTest(steps: number, testFn: () => void): number {
    const startTime = Math.round(performance.now());
    for (let i = 0; i < steps; i++) {
       testFn();
    }
    const endTime = Math.round(performance.now());
    return endTime - startTime;
}

function logMessage(message: string) {
    const mainElement = document.getElementById("main");
    if (!mainElement) {
        throw Error("no main element exist");
    }

    const msgElement = document.createElement("p");
    msgElement.innerText = message;
    mainElement.appendChild(msgElement);
}