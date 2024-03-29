import { Module } from '@nestjs/common'
import { AlbumService } from './album.service'
import { AlbumController } from './album.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Album } from '../../model/album.entity'
import { JwtStrategy } from '../auth/strategies/jwtStrategy'
import { UserModule } from '../user/user.module'
import { Band } from '../../model/band.entity'
import { FileModule } from '../file/file.module'
import { BandModule } from '../band/band.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Album, Band]),
    UserModule,
    FileModule,
    BandModule,
  ],
  providers: [AlbumService, JwtStrategy],
  controllers: [AlbumController],
  exports: [AlbumService],
})
export class AlbumModule {}
