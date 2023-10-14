import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import chatRouter from './routes/chat.router.js';
import sessionsRouter from './routes/sessions.router.js';
import productsViewsRouter from './routes/viewsRoutes/products-views.router.js'
import cartsViewsRouter from './routes/viewsRoutes/carts-views.router.js'
import chatViewsRouter from './routes/viewsRoutes/chat-views.router.js'
import sessionViewsRouter from './routes/viewsRoutes/sessions-views.router.js'



const run = (io,app)=>{
    app.use((req, res, next) => {
        req.io = io;
        next();
      });

        
    app.use('/',sessionViewsRouter)
    app.use('/products', productsViewsRouter)
    app.use('/carts', cartsViewsRouter)
    app.use('/chat', chatViewsRouter)

    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter)
    app.use('/api/chat',chatRouter)
    app.use('/api/sessions', sessionsRouter)


    io.on('connection', socket=>{
        console.log('Socket connected');
        socket.on('updatedProducts', data=>{
            console.log({Linea41APP:data})
            io.emit('newProductsList', data)
        })
        socket.on('newMessage', data =>{
            console.log(data)
            io.emit('log', data)
        })
    })

}


export default run


