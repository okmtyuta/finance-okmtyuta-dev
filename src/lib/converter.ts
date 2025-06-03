const nullableNumber = (target: unknown) => {
	if (typeof target !== "string") {
		return null
	}

	if (Number.isNaN(Number.parseInt(target))) {
		return null
	}

	return Number(target)
}
const optional = <Param, Return>(callback: (value: Param) => Return) => {
	const _optional = (target: Param) => {
		if (target != null) {
			return callback(target)
		}
	}

	return _optional
}

export const converter = {
	optional,
	nullableNumber,
}
