const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // x1 & x2 & x3
    x1 = (data[0] - 42.68804348) / 10.62617687
    x2 = (data[1] - 88.78804348) / 19.02325673
    x3 = (data[2] - 143.05) / 22.95735034
    return [x1, x2, x3]
}

function denormalized(data){
    y1 = (data[0] * 9.164668667) + 74.73804348
    y2 = (data[1] * 14.77138778) + 49.83913043
    y3 = (data[2] * 24.09366036) + 159.8793478
    return [y1, y2, y3]
}


async function predict(data){
    let in_dim = 3;
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/widyaseptiani/UAS_SC_24_WidyaSeptiani_41419010012/main/public/ex_model/model.json?token=5007720080:AAGDWoTJ2HXF6zeiZ3C9znAcvF1tsJS31Lc';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return denormalized( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    predict: predict 
}
  
