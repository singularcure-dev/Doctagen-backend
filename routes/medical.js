const express = require("express");
const router = express.Router();
const MedicalModel = require("../models/MedicalModel");
const WordsModel = require("../models/WordsModel");
const verifyToken = require("../libs/verifyToken");
const gens = require("../libs/gens");
const urlTest = require("../libs/format");

/*
 * 의료진 리스트
 */
router.get("/list", async (req, res) => {
    //  address 용 word  집어넣기 $and 조건  addressWord
    const { page = 1, limit = 10, searchWord, userId, addressWord, pageFlag } = req.query;
    let query = {};
    if (addressWord !== undefined && addressWord !== "") {
        query.$and = [
            {address: { $regex: `.*${addressWord}.*`, '$options': 'i'}},
        ]
    }
    if (searchWord !== undefined && searchWord !== "") {
        let gen = gens(searchWord.trim().toUpperCase());
        if (gen == "error"){
            const noData = [];
            return res.json({
                status: 200,
                data: noData,
                page: 1,
            });
        } else {
            query.description = gen;
        }
    }
    try {
        const count = await MedicalModel.find(query).countDocuments();
        const data = await MedicalModel.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
            data.forEach(doc => {
                // specialty
                let str = doc.specialty+``
                let strs = str.split(',');
                const sarr = strs.map(e=>e.replace(/"|\[|\]|\\/gm,'').toString().trim().replace(/\'/gi, ''))
                doc.specialty = sarr;
                // hospitals
                let hsp = doc.hospitals+``
                let hsps = hsp.split(',');
                const harr = hsps.map(e=>e.replace(/"|\[|\]|\\/gm,'').toString().trim().replace(/\'/gi, ''))
                doc.hospitals = harr;
                // 이미지 urltest
                if (!urlTest(doc.img_url)) {
                    doc.img_url = ""; 
                }
            })
        let searchDate = {
            word: searchWord,
            type: "gene",
            user: userId,
        }
        if (pageFlag == "false") {
            if (searchWord != null && searchWord != undefined && searchWord != "" ) {
                let Words = new WordsModel(searchDate);
                await Words.save();
            }
            if (addressWord != null && addressWord != undefined && addressWord != "" ){
                searchDate.word = addressWord;
                searchDate.type = "address";
                let AddressWords = new WordsModel(searchDate);
                await AddressWords.save();
            }
        }
        res.json({
            status: 200,
            data,
            total: count,
            page: page,
        });
    } catch (err) {
        res.json({ status: 500, error: true, message: err.message });
    }
});

/**
 * 유저 의료진 검색어 목록
 */
router.get("/word", verifyToken, async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    let query = {
        user:  req.userId,
    };
    try {
        const count = await WordsModel.find(query).countDocuments();
        const data = await WordsModel.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .exec();
        res.json({ 
            status: 200, 
            data,
            total: count,
            page: page,
        });
    } catch (err) {
        res.json({ status: 500, error: true, message: err.message });
    }
});

router.put("/word", verifyToken, async (req, res) => {
    const { wordId } = req.body; 
    let data = {
        user: undefined,
    }
    try {
        await WordsModel.updateOne({_id: wordId}, { $set: data });
        res.json({ status: 200, success: true });
    } catch (err) {
        console.log("put/word/ err", err.message);
        return res.json({ status: 500, error: true, message: err.message });
    }
})

/**
 * 의료진 상세 정보
 */
router.get("/:id", async (req, res) => {
    try {
        let data = await MedicalModel.findOne(
            { _id: req.params.id },
        ).exec();
        // specialty
        let str = data.specialty+``
        let strs = str.split(',');
        const sarr = strs.map(e=>e.replace(/"|\[|\]|\\/gm,'').toString().trim().replace(/\'/gi, ''))
        data.specialty = sarr;
        // hospitals
        let hsp = data.hospitals+``
        let hsps = hsp.split(',');
        const harr = hsps.map(e=>e.replace(/"|\[|\]|\\/gm,'').toString().trim().replace(/\'/gi, ''))
        data.hospitals = harr;
        // 이미지 urltest
        if (!urlTest(data.img_url)) {
            data.img_url = ""; 
        }
        res.json({ status: 200, data });
    } catch (err) {
        res.json({ status: 500, error: true, message: err.message });
    }
});

module.exports = router;
