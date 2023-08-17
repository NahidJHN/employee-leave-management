import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Department } from './schema/department.schema';
import { collectionsName } from '../constant';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(collectionsName.department)
    private readonly departmentModel: Model<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const hasDepartment = await this.departmentModel.findOne({
      admin: createDepartmentDto.admin,
      name: createDepartmentDto.name,
    });

    if (hasDepartment) {
      throw new BadRequestException('Department already exist');
    }
    const department = new this.departmentModel(createDepartmentDto);

    return department.save();
  }

  async findAll(admin: Types.ObjectId): Promise<Department[]> {
    return this.departmentModel.find({ admin });
  }

  async update(
    id: Types.ObjectId,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    // for unique department name
    const hasDepartment = await this.departmentModel.findOne({
      name: updateDepartmentDto.name,
      admin: updateDepartmentDto.admin,
      _id: { $ne: id },
    });

    if (hasDepartment)
      throw new BadRequestException('Department already exist');

    const department = await this.departmentModel.findByIdAndUpdate(
      id,
      { $set: updateDepartmentDto },
      { new: true },
    );

    if (!department) throw new NotFoundException('Department not found');

    return department;
  }

  async remove(id: Types.ObjectId): Promise<string> {
    return 'delete action is coming soon';
  }
}
