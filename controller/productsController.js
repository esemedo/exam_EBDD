exports.getProducts = (req, res, next) =>{
    try {
        
        res.status(200).json({message: "Network Error"})
        
    } catch (error) {
        res.status(500).json({message: "Network Error"})
    }
}