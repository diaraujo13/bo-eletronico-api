import express from "express";
import {BoletimController} from "../controllers";
const router = express.Router();

router
	.route('/boletim')
	.get( BoletimController.getAll)
	.post( BoletimController.create);

	router
		.route('/generateReport')
		.get( BoletimController.generateReport)





export default router;
